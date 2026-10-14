import { config } from './config';
import { fetchWithDigest } from './digest';

export type CardEvent = { cardNo: string; serialNo: string | null };

const credentials = { username: config.HIKVISION_USERNAME, password: config.HIKVISION_PASSWORD };
const HEADER_END = Buffer.from('\r\n\r\n');

function isapiUrl(path: string) {
  return new URL(path, config.HIKVISION_URL).toString();
}

// Newer firmware sends JSON, older firmware XML (EventNotificationAlert).
export function parseCardEvent(contentType: string, body: string): CardEvent | null {
  if (contentType.includes('json')) {
    try {
      const event = JSON.parse(body)?.AccessControllerEvent;
      const cardNo = typeof event?.cardNo === 'string' ? event.cardNo.trim() : '';
      return cardNo ? { cardNo, serialNo: event.serialNo != null ? String(event.serialNo) : null } : null;
    } catch {
      return null;
    }
  }
  if (contentType.includes('xml') && body.includes('AccessControllerEvent')) {
    const cardNo = /<cardNo>([^<]+)<\/cardNo>/.exec(body)?.[1]?.trim();
    const serialNo = /<serialNo>([^<]+)<\/serialNo>/.exec(body)?.[1]?.trim() ?? null;
    return cardNo ? { cardNo, serialNo } : null;
  }
  return null;
}

// Reads the multipart/mixed alert stream: each part has headers, an empty line and a body whose
// length is given by Content-Length. Parts can be images, so the buffer stays binary.
export async function* readAlertStream(signal: AbortSignal): AsyncGenerator<CardEvent> {
  const response = await fetchWithDigest(isapiUrl('/ISAPI/Event/notification/alertStream'), credentials, { signal });
  if (!response.ok || !response.body) {
    throw new Error(`alertStream answered ${response.status}`);
  }

  let buffer = Buffer.alloc(0);
  for await (const chunk of response.body) {
    buffer = Buffer.concat([buffer, chunk]);

    while (true) {
      const headerEnd = buffer.indexOf(HEADER_END);
      if (headerEnd === -1) break;

      const headers = buffer.subarray(0, headerEnd).toString('latin1');
      const length = Number(/content-length:\s*(\d+)/i.exec(headers)?.[1]);
      const bodyStart = headerEnd + HEADER_END.length;

      if (!Number.isFinite(length)) {
        // Boundary lines and preamble carry no Content-Length; skip past them.
        buffer = buffer.subarray(bodyStart);
        continue;
      }
      if (buffer.length < bodyStart + length) break;

      const contentType = /content-type:\s*([^\r\n;]+)/i.exec(headers)?.[1]?.toLowerCase() ?? '';
      const body = buffer.subarray(bodyStart, bodyStart + length).toString('utf8');
      buffer = buffer.subarray(bodyStart + length);

      const event = parseCardEvent(contentType, body);
      if (event) yield event;
    }
  }
}

export async function openDoor() {
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<RemoteControlDoor version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema"><cmd>open</cmd></RemoteControlDoor>';
  const response = await fetchWithDigest(
    isapiUrl(`/ISAPI/AccessControl/RemoteControl/door/${config.HIKVISION_DOOR}`),
    credentials,
    { method: 'PUT', headers: { 'Content-Type': 'application/xml' }, body },
  );
  await response.body?.cancel();
  if (!response.ok) {
    throw new Error(`door open answered ${response.status}`);
  }
}
