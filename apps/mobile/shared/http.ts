const REQUEST_TIMEOUT_MS = 20_000;

export const NETWORK_ERROR_MESSAGE = 'Poslužitelj nije dostupan. Provjeri vezu i pokušaj ponovno.';

export async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}
