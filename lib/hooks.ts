import {DependencyList, EffectCallback, useEffect, useRef, useState} from 'react';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return val;
}

export function usePostEffect(cb: EffectCallback, deps?: DependencyList) {
  const initial = useRef(false);
  useEffect(() => {
    if (!initial.current) {
      initial.current = true;
    } else {
      cb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
