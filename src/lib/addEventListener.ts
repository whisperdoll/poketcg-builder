/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
const EventListenerQueueMap: Record<
  any,
  Record<string, Record<number, Function[]>>
> = {};

export function removeOrderedEventListener(
  subject: any,
  event: any,
  fn: Function,
  level: number,
) {
  const index = EventListenerQueueMap[subject][event][level].indexOf(fn);
  EventListenerQueueMap[subject][event][level].splice(index, 1);
}

export function addOrderedEventListener(
  subject: any,
  event: string,
  fn: Function,
  level: number,
) {
  if (!EventListenerQueueMap[subject]) {
    EventListenerQueueMap[subject] = {};
  }

  if (!EventListenerQueueMap[subject][event]) {
    EventListenerQueueMap[subject][event] = {};

    subject.addEventListener(event, (...args: any[]) => {
      Object.entries(EventListenerQueueMap[subject][event])
        .sort(([keyA, _A], [keyB, _B]) => parseInt(keyA) - parseInt(keyB))
        .forEach(([_level, fns]) => {
          fns.forEach((fn) => fn(...args));
        });
    });
  }

  if (!EventListenerQueueMap[subject][event][level]) {
    EventListenerQueueMap[subject][event][level] = [];
  }

  EventListenerQueueMap[subject][event][level].push(fn);

  if (!(subject in EventListenerQueueMap)) {
    EventListenerQueueMap[subject] = {};
  }
}
