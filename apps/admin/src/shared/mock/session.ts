import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'gibigib-admin-signed-out';

function readSignedOut() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function writeSignedOut(signedOut: boolean) {
  try {
    if (signedOut) window.sessionStorage.setItem(STORAGE_KEY, '1');
    else window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
}

export const DEMO_PASSWORD = 'gibigib';

export const account = { name: 'Vlasnik', email: 'vlasnik@primjer.hr', password: DEMO_PASSWORD };

export const signedIn$ = new BehaviorSubject(!readSignedOut());

export function setSignedIn(signedIn: boolean) {
  writeSignedOut(!signedIn);
  signedIn$.next(signedIn);
}
