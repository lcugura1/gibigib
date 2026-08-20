const DOOR_OPEN_TTL_MS = 5000;

let doorOpenUntil = 0;

export function queueDoorOpen() {
  doorOpenUntil = Date.now() + DOOR_OPEN_TTL_MS;
}

export function consumeDoorCommand(): 'open' | 'idle' {
  if (Date.now() <= doorOpenUntil) {
    doorOpenUntil = 0;
    return 'open';
  }
  return 'idle';
}
