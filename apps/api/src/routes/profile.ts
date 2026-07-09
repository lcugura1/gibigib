import type { FastifyInstance } from 'fastify';
import { updateAvatarSchema } from '@gibigib/types';
import { removeAvatar, updateAvatar } from '../services/profile';

export async function profileRoutes(app: FastifyInstance) {
  app.put('/avatar', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { avatar } = updateAvatarSchema.parse(request.body);
    return reply.send(await updateAvatar(request.user.userId, avatar));
  });

  app.delete('/avatar', { preHandler: [app.authenticate] }, async (request, reply) => {
    return reply.send(await removeAvatar(request.user.userId));
  });
}
