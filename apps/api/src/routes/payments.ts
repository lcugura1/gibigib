import type { FastifyInstance } from 'fastify';
import { createPaymentSchema } from '@gibigib/types';
import { limitRequests } from '../plugins/rate-limit';
import { createPayment, getPayment, handleStripeWebhook, listPayments } from '../services/payment';

export async function paymentRoutes(app: FastifyInstance) {
  const limitCreate = limitRequests(app, 'payment-create', {
    max: 20,
    timeWindow: '15 minutes',
    key: (request) => request.user?.userId ?? request.ip,
  });

  app.post('/', { preHandler: [app.authenticate, limitCreate] }, async (request, reply) => {
    const input = createPaymentSchema.parse(request.body);
    return reply.code(201).send(await createPayment(request.user.userId, input, request.log));
  });

  app.get('/', { preHandler: [app.authenticate] }, async (request) => {
    return listPayments(request.user.userId);
  });

  app.get<{ Params: { id: string } }>('/:id', { preHandler: [app.authenticate] }, async (request) => {
    return getPayment(request.user.userId, request.params.id);
  });

  // Stripe signs the exact bytes it sent, so this route keeps the body unparsed.
  await app.register(async (webhook) => {
    webhook.removeContentTypeParser('application/json');
    webhook.addContentTypeParser('application/json', { parseAs: 'buffer' }, (_request, body, done) => {
      done(null, body);
    });

    webhook.post('/webhook', async (request) => {
      const signature = request.headers['stripe-signature'];
      await handleStripeWebhook(request.body as Buffer, typeof signature === 'string' ? signature : undefined);
      return { received: true };
    });
  });
}
