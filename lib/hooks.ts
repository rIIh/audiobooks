import { useState } from 'react';

export const useMergeState = <T>(
  initialValue: T,
): [T, (newValue: Partial<T>) => void] => {
  const [state, setState] = useState<T>(initialValue);

  return [
    state,
    newValue => {
      setState(last => ({ ...last, ...newValue }));
    },
  ];
};
