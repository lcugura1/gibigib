import { createHash, randomBytes } from 'node:crypto';

// Hikvision ISAPI only accepts HTTP Digest authentication (RFC 7616), which fetch does not do.

export type Credentials = { username: string; password: string };

type Challenge = { realm: string; nonce: string; qop?: string; opaque?: string; algorithm: string };

export type DigestInput = {
  algorithm: string;
  username: string;
  password: string;
  realm: string;
  nonce: string;
  method: string;
  uri: string;
  qop?: string;
  nc?: string;
  cnonce?: string;
};

function hash(algorithm: string, value: string) {
  return createHash(algorithm.toUpperCase().startsWith('SHA-256') ? 'sha256' : 'md5')
    .update(value)
    .digest('hex');
}

export function digestResponse(input: DigestInput) {
  const ha1 = hash(input.algorithm, `${input.username}:${input.realm}:${input.password}`);
  const ha2 = hash(input.algorithm, `${input.method}:${input.uri}`);
  return input.qop
    ? hash(input.algorithm, `${ha1}:${input.nonce}:${input.nc}:${input.cnonce}:${input.qop}:${ha2}`)
    : hash(input.algorithm, `${ha1}:${input.nonce}:${ha2}`);
}

export function parseAuthParams(header: string) {
  const params: Record<string, string> = {};
  for (const match of header.matchAll(/(\w+)=(?:"([^"]*)"|([^\s,]+))/g)) {
    const [, key, quoted, plain] = match;
    if (key) params[key.toLowerCase()] = quoted ?? plain ?? '';
  }
  return params;
}

function parseChallenge(header: string | null): Challenge | null {
  if (!header || !/^Digest\s/i.test(header)) return null;
  const params = parseAuthParams(header);
  if (!params.realm || !params.nonce) return null;
  return {
    realm: params.realm,
    nonce: params.nonce,
    qop: params.qop?.split(',').map((value) => value.trim()).find((value) => value === 'auth'),
    opaque: params.opaque,
    algorithm: params.algorithm ?? 'MD5',
  };
}

function authorization(challenge: Challenge, credentials: Credentials, method: string, uri: string) {
  const nc = '00000001';
  const cnonce = randomBytes(8).toString('hex');
  const response = digestResponse({ ...challenge, ...credentials, method, uri, nc, cnonce });
  const parts = [
    `username="${credentials.username}"`,
    `realm="${challenge.realm}"`,
    `nonce="${challenge.nonce}"`,
    `uri="${uri}"`,
    `algorithm=${challenge.algorithm}`,
    `response="${response}"`,
  ];
  if (challenge.qop) parts.push(`qop=${challenge.qop}`, `nc=${nc}`, `cnonce="${cnonce}"`);
  if (challenge.opaque) parts.push(`opaque="${challenge.opaque}"`);
  return `Digest ${parts.join(', ')}`;
}

// Sends the request once to get a challenge, then again with the answer.
export async function fetchWithDigest(url: string, credentials: Credentials, init: RequestInit = {}) {
  const method = init.method ?? 'GET';
  const first = await fetch(url, init);
  if (first.status !== 401) return first;

  const challenge = parseChallenge(first.headers.get('www-authenticate'));
  await first.body?.cancel();
  if (!challenge) return first;

  const { pathname, search } = new URL(url);
  return fetch(url, {
    ...init,
    headers: {
      ...Object.fromEntries(new Headers(init.headers)),
      Authorization: authorization(challenge, credentials, method, `${pathname}${search}`),
    },
  });
}
