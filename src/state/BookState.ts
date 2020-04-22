import {useCallback, useEffect, useRef, useState} from 'react';
import {ReplaySubject} from "rxjs";

type Transition = (nextState: keyof States) => void;

interface BookState {
  awake?: () => Promise<void> | void;
  dispose?: () => Promise<void> | void;
  load?: () =>  Promise<void> | void;
  toggle?: () => Promise<void> | void;
  download?: () => Promise<void> | void;
  clear?: () => Promise<void> | void;
}

interface States {
  Loading:      BookState;
  NoCache:      BookState;
  Ready:        BookState;
  Downloading:  BookState;
  Playing:      BookState;
  Clearing:     BookState;
  Destroying:   BookState;
}

export const useBookState = (states: States, initialState: keyof States) => {
  const [state, setState] = useState(() => states[initialState]);
  const [stateName, setStateName] = useState<keyof States>(initialState);
  const stateChanged = new ReplaySubject<void>(1);
  useEffect(() => {
    stateChanged.next();
    if (state.awake) {
      const promise = state.awake()
      if (promise) { promise.catch(console.warn); }
    }
    return () => { state.dispose?.(); };
  }, [state]);

  return {
    stateType: stateName,
    state: state,
    transit: (nextState: keyof States) => {
      setState(states[nextState]);
      setStateName(nextState);
    },
    stateChanged: stateChanged.asObservable(),
  };
};
