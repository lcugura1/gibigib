import 'dotenv/config';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { join } from 'node:path';
import { z } from 'zod';
import { digestResponse, parseAuthParams } from '../src/digest';

// Stands in for a Hikvision access terminal so the bridge can be tested without the device. It
// speaks the same ISAPI calls the bridge uses: the event stream and the remote door opening.

const env = z
  .object({
    SIMULATOR_PORT: z.coerce.number().int().positive().default(8090),
    SIMULATOR_USERNAME: z.string().min(1).default('admin'),
    SIMULATOR_PASSWORD: z.string().min(1).default('simulator123'),
  })
  .parse(process.env);

const REALM = 'DS-K1T502DBWX-CQR';
const BOUNDARY = 'MIME_boundary';
const HEARTBEAT_MS = 10_000;
// A Hikvision reader passes a QR code on only when it fits its card number field.
const CARD_NUMBER_PATTERN = /^\d{1,20}$/;

const nonces = new Set<string>();
const streams = new Set<ServerResponse>();
const pageClients = new Set<ServerResponse>();
let serialNo = 0;

function sameText(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function authorized(request: IncomingMessage) {
  const header = request.headers.authorization;
  if (!header?.startsWith('Digest ')) return false;
  const params = parseAuthParams(header);
  if (!params.nonce || !nonces.has(params.nonce) || params.username !== env.SIMULATOR_USERNAME) return false;

  const expected = digestResponse({
    algorithm: params.algorithm ?? 'MD5',
    username: env.SIMULATOR_USERNAME,
    password: env.SIMULATOR_PASSWORD,
    realm: REALM,
    nonce: params.nonce,
    method: request.method ?? 'GET',
    uri: params.uri ?? '',
    qop: params.qop,
    nc: params.nc,
    cnonce: params.cnonce,
  });
  return params.uri === request.url && sameText(expected, params.response ?? '');
}

function challenge(response: ServerResponse) {
  const nonce = randomBytes(16).toString('hex');
  if (nonces.size > 1000) nonces.clear();
  nonces.add(nonce);
  response.writeHead(401, {
    'WWW-Authenticate': `Digest realm="${REALM}", qop="auth", nonce="${nonce}", algorithm=MD5`,
  });
  response.end();
}

function writePart(stream: ServerResponse, payload: object) {
  const body = JSON.stringify(payload);
  stream.write(
    `--${BOUNDARY}\r\nContent-Type: application/json; charset="UTF-8"\r\n` +
      `Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}\r\n`,
  );
}

function notifyPage(event: object) {
  for (const client of pageClients) client.write(`data: ${JSON.stringify(event)}\n\n`);
}

// Same shape as a real terminal's event for a card it does not know (subEventType 9).
function emitCard(cardNo: string) {
  serialNo += 1;
  const event = {
    ipAddress: '127.0.0.1',
    dateTime: new Date().toISOString(),
    activePostCount: 1,
    eventType: 'AccessControllerEvent',
    eventState: 'active',
    eventDescription: 'Access Controller Event',
    AccessControllerEvent: {
      deviceName: 'GibiGib simulator',
      majorEventType: 5,
      subEventType: 9,
      cardNo,
      cardType: 1,
      cardReaderNo: 1,
      doorNo: 1,
      serialNo,
      currentVerifyMode: 'cardOrFace',
    },
  };
  for (const stream of streams) writePart(stream, event);
  return streams.size;
}

function readBody(request: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 10_000) {
        request.destroy();
        reject(new Error('body too large'));
      }
    });
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

async function handle(request: IncomingMessage, response: ServerResponse) {
  const url = new URL(request.url ?? '/', 'http://simulator');

  if (request.method === 'GET' && url.pathname === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(await readFile(join(import.meta.dirname, 'page.html')));
    return;
  }
  if (request.method === 'GET' && url.pathname === '/jsqr.js') {
    response.writeHead(200, { 'Content-Type': 'text/javascript' });
    response.end(await readFile(join(import.meta.dirname, '../../api/public/jsqr.js')));
    return;
  }
  if (request.method === 'GET' && url.pathname === '/simulator/events') {
    response.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
    response.write(`data: ${JSON.stringify({ type: 'status', bridges: streams.size })}\n\n`);
    pageClients.add(response);
    request.on('close', () => pageClients.delete(response));
    return;
  }
  if (request.method === 'POST' && url.pathname === '/simulator/card') {
    const { code } = z.object({ code: z.string().trim() }).parse(JSON.parse(await readBody(request)));
    if (!CARD_NUMBER_PATTERN.test(code)) {
      response.writeHead(422, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message: 'Čitač ne bi prihvatio ovaj kod: nije broj od najviše 20 znamenki.' }));
      return;
    }
    const bridges = emitCard(code);
    notifyPage({ type: 'card', code, bridges });
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ bridges }));
    return;
  }

  if (url.pathname.startsWith('/ISAPI/') && !authorized(request)) {
    challenge(response);
    return;
  }

  if (request.method === 'GET' && url.pathname === '/ISAPI/Event/notification/alertStream') {
    response.writeHead(200, { 'Content-Type': `multipart/mixed; boundary=${BOUNDARY}`, Connection: 'keep-alive' });
    streams.add(response);
    notifyPage({ type: 'status', bridges: streams.size });
    const heartbeat = setInterval(() => {
      writePart(response, { eventType: 'videoloss', eventState: 'inactive', dateTime: new Date().toISOString() });
    }, HEARTBEAT_MS);
    request.on('close', () => {
      clearInterval(heartbeat);
      streams.delete(response);
      notifyPage({ type: 'status', bridges: streams.size });
    });
    return;
  }

  const door = /^\/ISAPI\/AccessControl\/RemoteControl\/door\/(\d+)$/.exec(url.pathname);
  if (request.method === 'PUT' && door) {
    const body = await readBody(request);
    const command = /<cmd>(\w+)<\/cmd>/.exec(body)?.[1] ?? 'unknown';
    notifyPage({ type: 'door', door: Number(door[1]), command });
    console.log(`${new Date().toISOString()} door ${door[1]}: ${command}`);
    response.writeHead(200, { 'Content-Type': 'application/xml' });
    response.end(
      '<?xml version="1.0" encoding="UTF-8"?><ResponseStatus version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">' +
        '<requestURL>' + url.pathname + '</requestURL><statusCode>1</statusCode><statusString>OK</statusString>' +
        '<subStatusCode>ok</subStatusCode></ResponseStatus>',
    );
    return;
  }

  response.writeHead(404);
  response.end();
}

createServer((request, response) => {
  handle(request, response).catch((err) => {
    console.error(err);
    if (!response.headersSent) response.writeHead(400);
    response.end();
  });
  // Local only: the card endpoint has no authentication.
}).listen(env.SIMULATOR_PORT, '127.0.0.1', () => {
  console.log(`Hikvision simulator on http://localhost:${env.SIMULATOR_PORT}`);
});
