import { isFunction } from "./utils";

export {};
declare global {
  interface Array<T> {
    toMap<K, V>(hashFn: (element: T) => [K, V]): Map<K, V>;
    withIndexReplaced(index: number, value: T | ((old: T) => T)): T[];
    count(discriminator: (element: T, index: number) => unknown): number;
  }
}

Array.prototype.count = function count<T>(
  this,
  discriminator: (element: T, index: number) => unknown,
) {
  let count = 0;
  this.forEach((e, i) => (count += +!!discriminator(e, i)));

  return count;
};

Array.prototype.toMap = function toMap<T, K, V>(
  this: T[],
  hashFn: (element: T) => [K, V],
): Map<K, V> {
  const ret = new Map<K, V>();

  this.forEach((v) => {
    const [key, value] = hashFn(v);
    ret.set(key, value);
  });

  return ret;
};

Array.prototype.withIndexReplaced = function withIndexReplaced<T>(
  this: T[],
  index: number,
  value: T | ((old: T) => T),
) {
  const ret = this.slice(0);
  ret[index] = isFunction(value) ? value(ret[index]) : value;
  return ret;
};

export {};
declare global {
  interface Number {
    times<T>(fn: (i: number) => T): T[];
  }
}

Number.prototype.times = function <T>(this, fn: (i: number) => T) {
  const ret = [];
  for (let i = 0; i < this.valueOf(); i++) {
    ret.push(fn(i));
  }

  return ret;
};
