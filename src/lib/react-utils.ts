import type {
  Dispatch,
  SetStateAction} from "react";
import {
  type MutableRefObject,
  type RefCallback,
} from "react";
import { isNullOrUndefined } from "./utils";

type MutableRefList<T> = Array<
  RefCallback<T> | MutableRefObject<T> | undefined | null
>;

export function mergeRefs<T>(...refs: MutableRefList<T>): RefCallback<T> {
  return (val: T) => {
    setRef(val, ...refs);
  };
}

export function setRef<T>(val: T, ...refs: MutableRefList<T>): void {
  refs.forEach((ref) => {
    if (typeof ref === "function") {
      ref(val);
    } else if (!isNullOrUndefined(ref)) {
      ref.current = val;
    }
  });
}

export type SetStateType<T> = Dispatch<SetStateAction<T>>;
export type StateType<T, T2 = T> = [T, SetStateType<T2>];
