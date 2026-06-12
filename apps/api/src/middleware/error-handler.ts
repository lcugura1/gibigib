import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { HttpError } from '../utils/errors';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof ZodError) {
    return reply.code(400).send({ statusCode: 400, error: 'Bad Request', message: 'Neispravni podaci', issues: error.issues });
  }

  if (error instanceof HttpError) {
    return reply.code(error.statusCode).send({ statusCode: error.statusCode, message: error.message });
  }

  if (error.code === 'P2002') {
    return reply.code(409).send({ statusCode: 409, error: 'Conflict', message: 'Već postoji zapis s tom vrijednošću' });
  }

  if (error.statusCode && error.statusCode < 500) {
    return reply.code(error.statusCode).send({ statusCode: error.statusCode, message: error.message });
  }

  request.log.error(error);
  return reply.code(500).send({ statusCode: 500, error: 'Internal Server Error', message: 'Došlo je do pogreške' });
}
