import type { CreatePaymentInput, PaymentDto, PaymentIntentDto } from '@gibigib/types';
import { authedFetch } from '@/shared/api';

export function createPayment(input: CreatePaymentInput) {
  return authedFetch<PaymentIntentDto>('/payments', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function fetchPayment(id: string) {
  return authedFetch<PaymentDto>(`/payments/${id}`);
}
