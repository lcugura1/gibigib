import { hash, verify} from '@node-rs/argon2';

// OWASP minimum for Argon2id: 19 MiB memory, 2 iterations.
const ARGON2_OPTIONS = { memoryCost: 19_456, timeCost: 2, parallelism: 1 };
const ARGON2_PARAMS = /^\$argon2id\$v=\d+\$m=(\d+),t=(\d+),p=(\d+)\$/;

export const hashPassword = async (password: string) => {
  return await hash(password, ARGON2_OPTIONS);
};

export const verifyPassword = async (password: string, hash: string) => {
  return await verify(hash, password);
};

// Hashes made with other parameters (e.g. the library defaults used before) are replaced on login.
export const needsRehash = (hash: string) => {
  const params = ARGON2_PARAMS.exec(hash);
  return (
    !params ||
    Number(params[1]) !== ARGON2_OPTIONS.memoryCost ||
    Number(params[2]) !== ARGON2_OPTIONS.timeCost ||
    Number(params[3]) !== ARGON2_OPTIONS.parallelism
  );
};
