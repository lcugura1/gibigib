import { initPaymentSheet, initStripe, presentPaymentSheet } from '@stripe/stripe-react-native';
import type { MembershipProgramSlug } from '@gibigib/types';
import { createPayment, fetchPayment } from '@/features/payments/services/payments';

export const STRIPE_RETURN_URL = 'gibigib://stripe-redirect';

const CONFIRM_TIMEOUT_MS = 20_000;
const CONFIRM_POLL_MS = 1_500;

// paid: the server has granted the membership. processing: Stripe took the money but the server
// has not confirmed it yet. canceled: the member closed the payment sheet.
export type CheckoutResult = 'paid' | 'processing' | 'canceled';

export class CheckoutError extends Error {}

// Stripe confirms the payment to our server with a webhook, which can arrive a moment after the
// payment sheet closes. Until then the membership is not active yet.
async function waitForConfirmation(paymentId: string): Promise<CheckoutResult> {
  const deadline = Date.now() + CONFIRM_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      const payment = await fetchPayment(paymentId);
      if (payment.status === 'SUCCEEDED') return 'paid';
      if (payment.status === 'FAILED' || payment.status === 'CANCELED') {
        throw new CheckoutError('Plaćanje nije uspjelo. Novac nije naplaćen.');
      }
    } catch (err) {
      if (err instanceof CheckoutError) throw err;
    }
    await new Promise((resolve) => setTimeout(resolve, CONFIRM_POLL_MS));
  }
  return 'processing';
}

export async function payForProgram(programSlug: MembershipProgramSlug): Promise<CheckoutResult> {
  const intent = await createPayment({ programSlug });

  await initStripe({ publishableKey: intent.publishableKey, urlScheme: 'gibigib' });
  const init = await initPaymentSheet({
    merchantDisplayName: 'GibiGib',
    paymentIntentClientSecret: intent.clientSecret,
    returnURL: STRIPE_RETURN_URL,
    googlePay: { merchantCountryCode: 'HR', currencyCode: 'EUR', testEnv: __DEV__ },
  });
  if (init.error) {
    throw new CheckoutError(init.error.localizedMessage ?? init.error.message);
  }

  const result = await presentPaymentSheet();
  if (result.error) {
    if (result.error.code === 'Canceled') return 'canceled';
    throw new CheckoutError(result.error.localizedMessage ?? result.error.message);
  }

  return waitForConfirmation(intent.paymentId);
}
