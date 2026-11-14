import { throwError, type Observable } from 'rxjs';
import { respond } from '../../../shared/mock/respond';
import { account, setSignedIn } from '../../../shared/mock/session';

export type SignInFailure = 'wrong-password' | 'unknown-account';

export class SignInError extends Error {
  readonly reason: SignInFailure;

  constructor(reason: SignInFailure) {
    super(reason);
    this.reason = reason;
  }
}

export interface AuthApi {
  signIn(email: string, password: string): Observable<true>;
  requestPasswordReset(email: string): Observable<true>;
}

export const authApi: AuthApi = {
  signIn: (email, password) => {
    if (email.toLowerCase() !== account.email.toLowerCase())
      return throwError(() => new SignInError('unknown-account'));
    if (password !== account.password) return throwError(() => new SignInError('wrong-password'));
    return respond(() => {
      setSignedIn(true);
      return true as const;
    });
  },
  requestPasswordReset: () => respond(() => true as const),
};
