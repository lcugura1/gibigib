import { setTimeout as sleep } from 'node:timers/promises';
import { config } from './config';
import { openDoor, readAlertStream, type CardEvent } from './hikvision';

type ScanResult = { ok: boolean; message: string; memberName?: string };

const RECONNECT_MIN_MS = 1_000;
const RECONNECT_MAX_MS = 30_000;
const SEEN_EVENTS_LIMIT = 200;

const controller = new AbortController();
const seenEvents: string[] = [];

function log(message: string) {
  console.log(`${new Date().toISOString()} ${message}`);
}

async function scan(code: string): Promise<ScanResult> {
  const response = await fetch(new URL('/entry/scan', config.API_URL), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Device ${config.DEVICE_KEY}` },
    body: JSON.stringify({ code }),
    signal: AbortSignal.timeout(10_000),
  });
  const data = (await response.json().catch(() => ({}))) as Partial<ScanResult>;
  if (response.status === 401 || response.status === 403) {
    throw new Error(`API refused the device key: ${data.message ?? response.status}`);
  }
  return {
    ok: data.ok === true,
    message: data.message ?? `API answered ${response.status}`,
    memberName: data.memberName,
  };
}

// The terminal can resend an event after a reconnect. Serial numbers restart after a reboot, so the
// event time is part of the key.
function eventKey(event: CardEvent) {
  return event.serialNo ? `${event.serialNo}|${event.dateTime ?? ''}` : null;
}

async function handle(event: CardEvent) {
  const key = eventKey(event);
  if (key) {
    if (seenEvents.includes(key)) return;
    seenEvents.push(key);
    if (seenEvents.length > SEEN_EVENTS_LIMIT) seenEvents.shift();
  }

  let result: ScanResult;
  try {
    result = await scan(event.cardNo);
  } catch (err) {
    // Not answered, so a resent copy of this event may still be handled.
    if (key) seenEvents.splice(seenEvents.indexOf(key), 1);
    log(`scan failed: ${(err as Error).message}`);
    return;
  }

  if (!result.ok) {
    log(`denied: ${result.message}`);
    return;
  }

  try {
    await openDoor();
    log('granted, door opened');
  } catch (err) {
    log(`granted, but the door did not open: ${(err as Error).message}`);
  }
}

async function run() {
  let delay = RECONNECT_MIN_MS;

  while (!controller.signal.aborted) {
    try {
      log(`connecting to ${config.HIKVISION_URL}`);
      const onConnected = () => {
        delay = RECONNECT_MIN_MS;
        log('connected');
      };
      for await (const event of readAlertStream(controller.signal, onConnected)) {
        void handle(event);
      }
      log('alert stream closed');
    } catch (err) {
      if (controller.signal.aborted) break;
      log(`alert stream error: ${(err as Error).message}`);
    }

    try {
      await sleep(delay, undefined, { signal: controller.signal });
    } catch {
      break;
    }
    delay = Math.min(delay * 2, RECONNECT_MAX_MS);
  }
}

const shutdown = () => controller.abort();
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

await run();
