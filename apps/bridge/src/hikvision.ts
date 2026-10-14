import { config } from './config';
import { fetchWithDigest } from './digest';

export type CardEvent = { cardNo: string; serialNo: string | null; dateTime: string | null };

const credentials = { username: config.HIKVISION_USERNAME, password: config.HIKVISION_PASSWORD };
const HEADER_END = Buffer.from('\r\n\r\n');
// Without a single byte for this long, heartbeats included, the connection is treated as dead.
const STREAM_IDLE_MS = 60_000;
const MAX_PART_BYTES = 10 * 1024 * 1024;

function isapiUrl(path: string) {
  return new URL(path, config.HIKVISION_URL).toString();
}

// Newer firmware sends JSON, older firmware XML (EventNotificationAlert).
export function parseCardEvent(contentType: string, body: string): CardEvent | null {
  if (contentType.includes('json')) {
    try {
      const alert = JSON.parse(body);
      if (alert?.eventState && alert.eventState !== 'active') return null;
      const event = alert?.AccessControllerEvent;
      const cardNo = typeof event?.cardNo === 'string' ? event.cardNo.trim() : '';
      if (!cardNo) return null;
      return {
        cardNo,
        serialNo: event.serialNo != null ? String(event.serialNo) : null,
        dateTime: typeof alert.dateTime === 'string' ? alert.dateTime : null,
      };
    } catch {
      return null;
    }
  }
  if (contentType.includes('xml') && body.includes('AccessControllerEvent')) {
    const cardNo = /<cardNo>([^<]+)<\/cardNo>/.exec(body)?.[1]?.trim();
    const serialNo = /<serialNo>([^<]+)<\/serialNo>/.exec(body)?.[1]?.trim() ?? null;
    const dateTime = /<dateTime>([^<]+)<\/dateTime>/.exec(body)?.[1]?.trim() ?? null;
    return cardNo ? { cardNo, serialNo, dateTime } : null;
  }
  return null;
}

// Reads the multipart/mixed alert stream. Each part has headers, an empty line and a body. The body
// length comes from Content-Length; parts without it end at the next boundary. Parts can be
// images, so the buffer stays binary.
export async function* readAlertStream(signal: AbortSignal, onConnected: () => void): AsyncGenerator<CardEvent> {
  const idle = new AbortController();
  let idleTimer = setTimeout(() => idle.abort(), STREAM_IDLE_MS);
  const rearm = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => idle.abort(), STREAM_IDLE_MS);
  };

  try {
    const response = await fetchWithDigest(isapiUrl('/ISAPI/Event/notification/alertStream'), credentials, {
      signal: AbortSignal.any([signal, idle.signal]),
    });
    if (!response.ok || !response.body) {
      await response.body?.cancel();
      throw new Error(`alertStream answered ${response.status}`);
    }
    onConnected();

    const boundary = /boundary="?([^";]+)"?/i.exec(response.headers.get('content-type') ?? '')?.[1] ?? 'MIME_boundary';
    const delimiter = Buffer.from(`\r\n--${boundary}`);
    let buffer = Buffer.alloc(0);

    for await (const chunk of response.body) {
      rearm();
      buffer = Buffer.concat([buffer, chunk]);
      if (buffer.length > MAX_PART_BYTES) {
        throw new Error('alertStream part is too large');
      }

      while (true) {
        const headerEnd = buffer.indexOf(HEADER_END);
        if (headerEnd === -1) break;

        const headers = buffer.subarray(0, headerEnd).toString('latin1');
        const bodyStart = headerEnd + HEADER_END.length;
        const contentType = /content-type:\s*([^\r\n;]+)/i.exec(headers)?.[1]?.toLowerCase();

        if (!contentType) {
          // Preamble or a bare boundary line: nothing to read yet.
          buffer = buffer.subarray(bodyStart);
          continue;
        }

        const lengthHeader = /content-length:\s*(\d+)/i.exec(headers)?.[1];
        let bodyEnd: number;
        if (lengthHeader !== undefined) {
          const length = Number(lengthHeader);
          if (length > MAX_PART_BYTES) throw new Error('alertStream part is too large');
          bodyEnd = bodyStart + length;
          if (buffer.length < bodyEnd) break;
        } else {
          bodyEnd = buffer.indexOf(delimiter, bodyStart);
          if (bodyEnd === -1) break;
        }

        const body = buffer.subarray(bodyStart, bodyEnd).toString('utf8');
        buffer = buffer.subarray(bodyEnd);

        const event = parseCardEvent(contentType, body);
        if (event) yield event;
      }
    }
  } finally {
    clearTimeout(idleTimer);
  }
}

export async function openDoor() {
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<RemoteControlDoor version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema"><cmd>open</cmd></RemoteControlDoor>';
  const response = await fetchWithDigest(
    isapiUrl(`/ISAPI/AccessControl/RemoteControl/door/${config.HIKVISION_DOOR}`),
    credentials,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/xml' },
      body,
      signal: AbortSignal.timeout(10_000),
    },
  );
  await response.body?.cancel();
  if (!response.ok) {
    throw new Error(`door open answered ${response.status}`);
  }
}
