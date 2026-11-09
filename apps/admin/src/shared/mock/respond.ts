import { NEVER, defer, of, throwError, type Observable } from 'rxjs';
import { mockState } from './fixtures';

export class NotFoundError extends Error {}

export function respond<T>(produce: () => T | undefined): Observable<T> {
  if (mockState === 'loading') return NEVER;
  if (mockState === 'error') return throwError(() => new Error('Mock server unavailable'));
  return defer(() => {
    const value = produce();
    return value === undefined ? throwError(() => new NotFoundError()) : of(value);
  });
}
