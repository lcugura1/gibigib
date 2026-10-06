import { hash, verify} from '@node-rs/argon2';

// OWASP minimum for Argon2id: 19 MiB memory, 2 iterations. Existing hashes keep their own parameters.
const ARGON2_OPTIONS = { memoryCost: 19_456, timeCost: 2, parallelism: 1 };

export const hashPassword = async (password: string) => {
  return await hash(password, ARGON2_OPTIONS);
};

export const verifyPassword = async (password: string, hash: string) => {
  return await verify(hash, password);
};
