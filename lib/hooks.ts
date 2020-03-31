import { DependencyList, useEffect, useState } from 'react';

export const useMergeState = <T>(initialValue: T): [T, (newValue: Partial<T>) => void] => {
  const [state, setState] = useState<T>(initialValue);

  return [
    state,
    newValue => {
      setState(last => ({ ...last, ...newValue }));
    },
  ];
};

export function useAsyncMemo<T>(factory: () => Promise<T | undefined | null>, deps: DependencyList, initial: T): T {
  const [val, setVal] = useState<T>(initial);
  useEffect(() => {
    let cancel = false;
    const promise = factory();
    if (promise === undefined || promise === null) {
      return;
    }
    promise.then(val => {
      if (!cancel && val) {
        setVal(val);
      }
    });
    return () => {
      cancel = true;
    };
  }, [factory]);
  return val;
}
