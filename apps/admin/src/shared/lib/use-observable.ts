import { useMemo, useSyncExternalStore } from 'react';
import type { Observable } from 'rxjs';

export function useObservable<T>(source$: Observable<T>, initial: T): T {
  const store = useMemo(() => {
    let current = initial;
    return {
      subscribe: (notify: () => void) => {
        const subscription = source$.subscribe((value) => {
          current = value;
          notify();
        });
        return () => subscription.unsubscribe();
      },
      getSnapshot: () => current,
    };
  }, [source$]);

  return useSyncExternalStore(store.subscribe, store.getSnapshot);
}
