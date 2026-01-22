import { useEffect } from "react";

type KnownEventTargetMap = {
  Window: WindowEventMap;
  Document: DocumentEventMap;
  HTMLElement: HTMLElementEventMap;
  SVGElement: SVGElementEventMap;
};

export type EventMapFor<T> = T extends Window
  ? WindowEventMap
  : T extends Document
    ? DocumentEventMap
    : T extends SVGElement
      ? SVGElementEventMap
      : T extends HTMLElement
        ? HTMLElementEventMap
        : Record<string, Event>;

export default function useEventListener<
  T extends EventTarget,
  K extends keyof EventMapFor<T>,
>(
  target: T | null,
  type: K,
  handler: (this: T, ev: EventMapFor<T>[K]) => unknown,
  options?: boolean | AddEventListenerOptions,
  dependencyArray?: unknown[],
) {
  useEffect(() => {
    if (!target) return;

    const fn = handler as EventListener;
    target.addEventListener(type as string, fn, options);
    return () => target.removeEventListener(type as string, fn, options);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, type, handler, options, ...(dependencyArray || [])]);
}
