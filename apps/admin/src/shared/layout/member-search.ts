import { BehaviorSubject } from 'rxjs';

export const memberSearch$ = new BehaviorSubject('');

export const setMemberSearch = (text: string) => memberSearch$.next(text);
