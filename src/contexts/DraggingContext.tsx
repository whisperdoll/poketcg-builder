import type { CardId } from "@/lib/deck";
import { createContext, useContext, useRef } from "react";
import type { SetStateType, StateType } from "../lib/react-utils";
import { pointInRect } from "@/lib/utils";
import useEventListener from "@/hooks/useEventListener";

type DraggingTarget = "deck" | "hand" | "bench" | "active";
export type DraggingContextType = {
  cards: {
    id: CardId;
    context?: Record<string, unknown>;
    source: null | DraggingTarget;
  }[];
  sourceCleanup?: (
    destination: DraggingTarget,
    context?: Record<string, unknown>,
  ) => unknown;
};

export const DraggingContext = createContext<
  StateType<DraggingContextType | null, DraggingContextType | null>
>([
  null,
  (_) => {
    throw new Error("ruh oh");
  },
]);

export interface UseDragDropProps<
  DropTarget extends HTMLElement = HTMLElement,
> {
  dropTarget: DropTarget | null;
  onDrag: (opts: {
    e: MouseEvent;
    dragging: DraggingContextType;
    setDragging: SetStateType<DraggingContextType | null>;
    target: DropTarget;
  }) => unknown;
  onDrop: (opts: {
    e: MouseEvent;
    dropping: DraggingContextType;
    setDragging: SetStateType<DraggingContextType | null>;
    target: DropTarget;
  }) => unknown;
  onMouseUp?: (opts: {
    e: MouseEvent;
    dropping: DraggingContextType | null;
    isInBounds: boolean;
  }) => unknown;
  onMouseLeave?: (opts: {
    e: MouseEvent;
    dragging: DraggingContextType | null;
  }) => unknown;
  onMouseMove?: (opts: {
    e: MouseEvent;
    dragging: DraggingContextType | null;
    isInBounds: boolean;
  }) => unknown;
  onMouseDown?: (opts: {
    e: MouseEvent;
    dragging: DraggingContextType | null;
    isInBounds: boolean;
  }) => unknown;
}

export const useDragDrop = <DropTarget extends HTMLElement>({
  dropTarget,
  onDrag,
  onDrop,
  onMouseUp,
  onMouseLeave,
  onMouseMove,
  onMouseDown,
}: UseDragDropProps<DropTarget>) => {
  const [dragging, setDragging] = useContext(DraggingContext);
  const isInBounds = useRef(false);

  useEventListener(
    document,
    "mousemove",
    (e) => {
      if (!dragging || !dropTarget) {
        onMouseMove &&
          onMouseMove({ e, dragging, isInBounds: isInBounds.current });
        return;
      }

      const mousePosition = { x: e.clientX, y: e.clientY };
      const dropTargetBounds = dropTarget.getBoundingClientRect();

      if (!pointInRect(mousePosition, dropTargetBounds)) {
        const wasInBounds = isInBounds.current;
        isInBounds.current = false;
        onMouseMove &&
          onMouseMove({ e, dragging, isInBounds: isInBounds.current });
        if (wasInBounds) {
          onMouseLeave && onMouseLeave({ e, dragging });
        }
        return;
      }

      isInBounds.current = true;
      onMouseMove &&
        onMouseMove({ e, dragging, isInBounds: isInBounds.current });
      onDrag({ e, dragging, setDragging, target: dropTarget });
    },
    undefined,
    [dragging, onDrag, dropTarget],
  );

  useEventListener(
    document,
    "mouseup",
    (e) => {
      if (!dragging || !dropTarget) {
        onMouseUp &&
          onMouseUp({ e, dropping: null, isInBounds: isInBounds.current });
        return;
      }

      const mousePosition = { x: e.clientX, y: e.clientY };
      const dropTargetBounds = dropTarget.getBoundingClientRect();
      isInBounds.current = pointInRect(mousePosition, dropTargetBounds);

      onMouseUp &&
        onMouseUp({ e, dropping: null, isInBounds: isInBounds.current });

      if (!isInBounds.current) {
        return;
      }

      onDrop({ e, dropping: dragging, setDragging, target: dropTarget });
    },
    undefined,
    [dragging, onDrop, dropTarget],
  );

  useEventListener(
    document,
    "mousedown",
    (e) => {
      if (!dropTarget) {
        onMouseDown &&
          onMouseDown({ e, dragging, isInBounds: isInBounds.current });
        return;
      }
      const mousePosition = { x: e.clientX, y: e.clientY };
      const dropTargetBounds = dropTarget.getBoundingClientRect();
      isInBounds.current = pointInRect(mousePosition, dropTargetBounds);

      onMouseDown &&
        onMouseDown({ e, dragging, isInBounds: isInBounds.current });
    },
    undefined,
    [dragging, onMouseUp, dropTarget],
  );

  return { dragging, setDragging };
};
