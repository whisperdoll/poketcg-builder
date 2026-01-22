import {
  DraggingContext,
  useDragDrop,
  type UseDragDropProps,
} from "@/contexts/DraggingContext";
import type { CardId } from "@/lib/deck";
import type { SetStateType } from "@/lib/react-utils";
import { arrayWithoutIndex, isInRange, pointInRect } from "@/lib/utils";
import { useCallback, useContext, useRef, useState } from "react";
import Card from "./card";

type Props = {
  bench: CardId[];
  setBench: SetStateType<CardId[]>;
  isFlipped: boolean;
};

export default function BattleBench({ bench, setBench, isFlipped }: Props) {
  const benchRef = useRef<HTMLDivElement>(null);
  const [benchHovered, setBenchHovered] = useState(false);
  const dropDecoRef = useRef<HTMLDivElement>(null);
  const [draggingInfo, setDraggingInfo] = useContext(DraggingContext);
  const insertIndex = useRef<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const hoveredCard = hoveredIndex === -1 ? null : bench[hoveredIndex];
  const mouseDownCardIndex = useRef<number>(-1);
  const mouseMovingCardIndex = useRef<number>(-1);

  const onMouseDown = useCallback<
    Exclude<UseDragDropProps["onMouseDown"], undefined>
  >(
    ({ e, dragging, isInBounds }) => {
      if (dragging || !isInBounds || !hoveredCard) return;
    },
    [hoveredCard],
  );

  useDragDrop({
    dropTarget: benchRef.current,
    onDrag({ e, dragging, target }) {
      if (!dropDecoRef.current || !dragging.cards.length || isFlipped) return;

      const mousePosition = { x: e.clientX, y: e.clientY };
      const benchBounds = target.getBoundingClientRect();
      const benchHovered = pointInRect(mousePosition, benchBounds);
      setBenchHovered(benchHovered);
      if (!benchHovered) {
        insertIndex.current = null;
        dropDecoRef.current!.style.display = "none";
        return;
      }

      const benchCards = target.querySelectorAll<HTMLElement>(".benchCard");
      const gapPercent = 20;
      let foundAction = false;

      Array.from(benchCards).forEach((benchCard, i) => {
        const benchCardBounds = benchCard.getBoundingClientRect();
        // check before gap
        const beforeGapX = benchCardBounds.left;
        const beforeGapWidth = benchCardBounds.width * (gapPercent / 100);
        const beforeGap = isInRange(
          mousePosition.x,
          beforeGapX,
          beforeGapX + beforeGapWidth,
        );

        if (beforeGap) {
          insertIndex.current = i;
          dropDecoRef.current!.style.display = "block";
          dropDecoRef.current!.style.backgroundColor = "blue";
          dropDecoRef.current!.style.left = `${beforeGapX}px`;
          dropDecoRef.current!.style.top = `${benchCardBounds.y}px`;
          dropDecoRef.current!.style.width = `${beforeGapWidth}px`;
          dropDecoRef.current!.style.height = `${benchCardBounds.height}px`;
          foundAction = true;
          return;
        }

        // check card hover
        const cardHoverX = beforeGapX + beforeGapWidth;
        const cardHoverWidth = benchCardBounds.width - beforeGapWidth * 2;
        const cardHover = isInRange(
          mousePosition.x,
          cardHoverX,
          cardHoverX + cardHoverWidth,
        );

        if (cardHover) {
          insertIndex.current = null;
          dropDecoRef.current!.style.display = "block";
          dropDecoRef.current!.style.backgroundColor = "red";
          dropDecoRef.current!.style.left = `${benchCardBounds.x}px`;
          dropDecoRef.current!.style.width = `${benchCardBounds.width}px`;
          dropDecoRef.current!.style.height = `${benchCardBounds.height / 2}px`;
          foundAction = true;

          const onTop = isInRange(
            mousePosition.y,
            benchCardBounds.y,
            benchCardBounds.y + benchCardBounds.height / 2,
          );
          if (onTop) {
            dropDecoRef.current!.style.top = `${benchCardBounds.y}px`;
          } else {
            dropDecoRef.current!.style.top = `${
              benchCardBounds.y + benchCardBounds.height / 2
            }px`;
          }
          return;
        }

        // check after gap
        const afterGapX = cardHoverX + cardHoverWidth;
        const afterGapWidth = beforeGapWidth;
        const afterGap = isInRange(
          mousePosition.x,
          afterGapX,
          afterGapX + afterGapWidth,
        );

        if (afterGap) {
          insertIndex.current = i + 1;
          dropDecoRef.current!.style.display = "block";
          dropDecoRef.current!.style.backgroundColor = "blue";
          dropDecoRef.current!.style.left = `${afterGapX}px`;
          dropDecoRef.current!.style.top = `${benchCardBounds.y}px`;
          dropDecoRef.current!.style.width = `${afterGapWidth}px`;
          dropDecoRef.current!.style.height = `${benchCardBounds.height}px`;
          foundAction = true;
          return;
        }

        // check post gap
        const postGapX = afterGapX + afterGapWidth;
        const postGapWidth =
          i !== benchCards.length - 1
            ? benchCards[i + 1].getBoundingClientRect().x - postGapX
            : benchBounds.width - postGapX + benchBounds.x;
        const postGap = isInRange(
          mousePosition.x,
          postGapX,
          postGapX + postGapWidth,
        );

        if (postGap) {
          insertIndex.current = i + 1;
          dropDecoRef.current!.style.display = "block";
          dropDecoRef.current!.style.backgroundColor = "blue";
          dropDecoRef.current!.style.left = `${postGapX}px`;
          dropDecoRef.current!.style.top = `${benchCardBounds.y}px`;
          dropDecoRef.current!.style.width = `${postGapWidth}px`;
          dropDecoRef.current!.style.height = `${benchCardBounds.height}px`;
          foundAction = true;
          return;
        }
      });

      if (!foundAction) {
        dropDecoRef.current!.style.display = "none";
        insertIndex.current = null;
      }
    },
    onDrop({ e, dropping, target }) {
      const indexToInsert = insertIndex.current;
      if (indexToInsert === null) return;

      const idsToInsert = dropping.cards.map((c) => c.id);

      setBench((bench) => [
        ...bench.slice(0, indexToInsert),
        ...idsToInsert,
        ...bench.slice(indexToInsert),
      ]);
      dropping.sourceCleanup &&
        dropping.sourceCleanup("bench", { index: indexToInsert });
      insertIndex.current = null;
    },
    onMouseUp({ e }) {
      if (!dropDecoRef.current) return;
      dropDecoRef.current.style.display = "none";
      mouseMovingCardIndex.current = -1;
      mouseDownCardIndex.current = -1;
    },
    onMouseLeave() {
      if (!dropDecoRef.current) return;
      dropDecoRef.current.style.display = "none";
    },
    onMouseDown,
    onMouseMove({ e, dragging, isInBounds }) {
      (() => {
        if (dragging || !isInBounds || mouseDownCardIndex.current === -1)
          return;
        if (!bench[mouseDownCardIndex.current]) return;

        mouseMovingCardIndex.current = mouseDownCardIndex.current;
        const indexToRemove = mouseMovingCardIndex.current;
        setDraggingInfo({
          cards: [
            {
              id: bench[mouseMovingCardIndex.current],
              context: { originalIndex: mouseMovingCardIndex.current },
              source: "bench",
            },
          ],
          sourceCleanup(destination, context) {
            setBench((bench) => arrayWithoutIndex(bench, indexToRemove));
          },
        });
      })();
    },
  });

  return (
    <>
      <div
        className="fixed z-[500] bg-red-500 opacity-50"
        ref={dropDecoRef}
      ></div>
      <div
        ref={benchRef}
        className={`flex grow flex-row gap-2 ${
          !isFlipped && benchHovered && draggingInfo?.cards.length
            ? "outline outline-4 outline-white"
            : ""
        }`}
      >
        {bench.map((id, i) => (
          <Card
            hideFavIcon
            id={id}
            key={`${id}-${i}`}
            onHoverChange={(hovered) => hovered && setHoveredIndex(i)}
            containerProps={{
              className: "justify-end",
            }}
            cardProps={{
              onMouseDown: () => (mouseDownCardIndex.current = i),
              className:
                "benchCard max-h-[85%] min-h-0 benchCard-${i} relative cursor-pointer hover:bottom-2",
            }}
          />
        ))}
      </div>
    </>
  );
}
