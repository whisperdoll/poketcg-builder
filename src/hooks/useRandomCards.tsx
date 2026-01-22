import type { CardId } from "@/lib/deck";
import { arrayFromGenerator, infiniteShuffledGenerator } from "@/lib/utils";
import cards from "@/resources/cards";
import { useMemo } from "react";

type ValidType = number | undefined;

type ObjectType<T> = T extends number
  ? CardId[]
  : T extends undefined
    ? () => CardId
    : never;

export default function useRandomCards<T extends ValidType>(
  n: T,
): ObjectType<T> {
  const generator = useMemo(
    () => infiniteShuffledGenerator<CardId>(Object.keys(cards)),
    [],
  );

  const array = useMemo(() => {
    if (!n) return null;

    return arrayFromGenerator<CardId>(generator, n);
  }, [n, generator]);

  return n === undefined
    ? (generator as ObjectType<T>)
    : (array as ObjectType<T>);
}
