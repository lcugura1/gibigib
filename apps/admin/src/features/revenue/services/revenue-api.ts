import type { PaymentsPageDto, PaymentsQuery, RevenueDto, RevenueQuery } from '@gibigib/types';
import type { Observable } from 'rxjs';
import { respond } from '../../../shared/mock/respond';
import { stripeAccount } from '../../../shared/mock/stripe-account';
import { samplePayments, samplePaymentsCsv, sampleRevenue } from './sample-data';

export type PaymentsCriteria = Omit<PaymentsQuery, 'page' | 'pageSize'>;

export interface RevenueApi {
  revenue(query: RevenueQuery): Observable<RevenueDto>;
  payments(query: PaymentsQuery): Observable<PaymentsPageDto>;
  exportPaymentsCsv(criteria: PaymentsCriteria): Observable<string>;
  connectStripe(): Observable<true>;
}

export const revenueApi: RevenueApi = {
  revenue: (query) => respond(() => sampleRevenue(query)),
  payments: (query) => respond(() => samplePayments(query)),
  exportPaymentsCsv: (criteria) => respond(() => samplePaymentsCsv(criteria)),
  connectStripe: () =>
    respond(() => {
      stripeAccount.connected = true;
      return true as const;
    }),
};
