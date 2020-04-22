export const asyncForEach = async <T>(array: Array<T>, callback: (value: T, index: number, array: Array<T>) => Promise<void>) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const syncForEach = async <T>(array: Array<T>, callback: (value: T, index: number, array: Array<T>) => Promise<void>) => {
  const promises: Promise<void>[] = [];
  for (let index = 0; index < array.length; index++) {
    promises.push(callback(array[index], index, array));
  }
  await Promise.all(promises);
};
