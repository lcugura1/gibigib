import { config } from './config';
import { openDoor, readAlertStream, type CardEvent } from './hikvision';

type ScanResult = { ok: boolean; message: string; memberName?: string };

const RECONNECT_MIN_MS = 1_000;
const RECONNECT_MAX_MS = 30_000;
const SEEN_SERIALS_LIMIT = 200;

const controller = new AbortController();
const seenSerials: string[] = [];

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

// The terminal can send the same event twice after a reconnect; the serial number tells them apart.
function alreadySeen(event: CardEvent) {
  if (!event.serialNo) return false;
  if (seenSerials.includes(event.serialNo)) return true;
  seenSerials.push(event.serialNo);
  if (seenSerials.length > SEEN_SERIALS_LIMIT) seenSerials.shift();
  return false;
}

async function handle(event: CardEvent) {
  if (alreadySeen(event)) return;

  try {
    const result = await scan(event.cardNo);
    if (!result.ok) {
      log(`denied: ${result.message}`);
      return;
    }
    await openDoor();
    log(`granted, door opened${result.memberName ? ` for ${result.memberName}` : ''}`);
  } catch (err) {
    log(`scan failed: ${(err as Error).message}`);
  }
}

async function run() {
  let delay = RECONNECT_MIN_MS;

  while (!controller.signal.aborted) {
    try {
      log(`connecting to ${config.HIKVISION_URL}`);
      for await (const event of readAlertStream(controller.signal)) {
        delay = RECONNECT_MIN_MS;
        void handle(event);
      }
      log('alert stream closed');
    } catch (err) {
      if (controller.signal.aborted) break;
      log(`alert stream error: ${(err as Error).message}`);
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
    delay = Math.min(delay * 2, RECONNECT_MAX_MS);
  }
}

const shutdown = () => controller.abort();
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

await run();
