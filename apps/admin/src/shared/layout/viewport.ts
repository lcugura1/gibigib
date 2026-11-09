import { defer, distinctUntilChanged, fromEvent, map, merge, shareReplay, startWith } from 'rxjs';
import { useObservable } from '../lib/use-observable';

export type Viewport = 'phone' | 'tablet' | 'desktop';

const tablet = window.matchMedia('(width >= 768px)');
const desktop = window.matchMedia('(width >= 1200px)');

const readViewport = (): Viewport => (desktop.matches ? 'desktop' : tablet.matches ? 'tablet' : 'phone');

export const viewport$ = defer(() =>
  merge(fromEvent(tablet, 'change'), fromEvent(desktop, 'change')).pipe(map(readViewport), startWith(readViewport())),
).pipe(distinctUntilChanged(), shareReplay({ bufferSize: 1, refCount: true }));

export const useViewport = () => useObservable(viewport$, readViewport());

const split = window.matchMedia('(width >= 1024px)');

export const splitLayout$ = defer(() =>
  fromEvent(split, 'change').pipe(
    map(() => split.matches),
    startWith(split.matches),
  ),
).pipe(distinctUntilChanged(), shareReplay({ bufferSize: 1, refCount: true }));

export const useSplitLayout = () => useObservable(splitLayout$, split.matches);
