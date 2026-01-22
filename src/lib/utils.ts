export const isFunction = (x: unknown) => typeof x === "function";
export const isNullOrUndefined = (x: unknown) => x === undefined || x === null;

export function tryParseInt<T>(
  n: string | number | undefined | null,
  backup: T,
): number | T;
export function tryParseInt(
  n: string | number | undefined | null,
  backup = null,
): number | null {
  if (isNullOrUndefined(n)) return backup;
  if (typeof n === "number") return Math.floor(n);

  const parsed = parseInt(n);
  return isNaN(parsed) ? backup : parsed;
}

export function multiplyArray<T>(array: T[], n: number): T[] {
  const ret: T[] = [];
  for (let i = 0; i < n; i++) {
    ret.push(...array);
  }
  return ret;
}

export function arrayFromGenerator<T>(
  generator: (() => T) | ((i: number) => T),
  n: number,
): T[] {
  const ret: T[] = [];
  for (let i = 0; i < n; i++) {
    ret.push(generator(i));
  }
  return ret;
}

export function infiniteShuffledGenerator<T>(
  source: T[],
  rngGenerator: () => number = Math.random,
): () => T {
  const mySource = shuffled(source, rngGenerator);
  let counter = 0;

  return () => {
    if (counter === source.length) {
      counter = 0;
      shuffle(mySource, rngGenerator);
    }

    return mySource[counter++];
  };
}

export function splitmix32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x9e3779b9) | 0;
    let t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

export function shuffle(
  array: unknown[],
  rngGenerator: () => number = Math.random,
) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(rngGenerator() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

export function shuffled<T>(
  array: T[],
  rngGenerator: () => number = Math.random,
) {
  const copy = array.slice(0);
  shuffle(copy, rngGenerator);
  return copy;
}

export function pointInRect(
  point: { x: number; y: number },
  rectangle: { x: number; y: number; width: number; height: number },
) {
  return (
    point.x >= rectangle.x &&
    point.x <= rectangle.x + rectangle.width &&
    point.y >= rectangle.y &&
    point.y <= rectangle.y + rectangle.height
  );
}

export function isInRange(
  x: number,
  rangeMin: number,
  rangeMax: number,
  minInclusive: boolean = true,
  maxInclusive: boolean = true,
) {
  const minSatisfied = minInclusive ? x >= rangeMin : x > rangeMin;
  const maxSatisfied = maxInclusive ? x <= rangeMax : x < rangeMax;

  return minSatisfied && maxSatisfied;
}

export function arrayWithoutIndex<T>(array: T[], index: number) {
  const copy = array.slice(0);
  copy.splice(index, 1);
  return copy;
}
