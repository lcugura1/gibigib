import { BehaviorSubject } from 'rxjs';

export const moreSheetOpen$ = new BehaviorSubject(false);

export const openMoreSheet = () => moreSheetOpen$.next(true);
export const closeMoreSheet = () => moreSheetOpen$.next(false);
