import { Container } from 'unstated-next';
import React from 'react';

const nest = (containers: Container<any>[], children: any, index: number = 0) => {
  if (containers.length > 0) {
    const [First, ...rest] = containers;
    return <First.Provider key={index}>{nest(rest, children, index + 1)}</First.Provider>;
  }
  return children;
};

const compose = (...containers: Container<any>[]) => ({
  Provider: ({ children }: { children: any }) => {
    return nest(containers, children);
  },
});

export default compose;
