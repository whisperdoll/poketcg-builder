import Card from "./card";
import { useContext, useEffect, useRef, useState } from "react";
import { arrayWithoutIndex, pointInRect } from "@/lib/utils";
import type { CardId } from "@/lib/deck";
import CardCloseup from "./cardCloseup";
import { DraggingContext } from "@/contexts/DraggingContext";
import type { SetStateType } from "@/lib/react-utils";
import {
  addOrderedEventListener,
  removeOrderedEventListener,
} from "@/lib/addEventListener";

type Props = {
  flipped?: boolean;
  cards: (CardId | null)[];
  setCards: SetStateType<(CardId | null)[]>;
};

export default function BattleHand({ flipped, cards, setCards }: Props) {
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const cardsInHand = cards.length;
  const [closeupCardIndex, setCloseupCardIndex] = useState<number | null>(null);
  const mouseDownCardIndex = useRef<number | null>(null);
  const mouseMovingCardIndex = useRef<number | null>(null);
  const [draggingInfo, setDraggingInfo] = useContext(DraggingContext);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<HTMLDivElement>(null);
  const pivotCardIndex = hoveredCardIndex || 0;

  function handleCardMouseDown(e: MouseEvent, i: number) {
    mouseDownCardIndex.current = i;
  }

  // useDragDrop({
  //   dropTarget: handRef.current!,
  //   onDrag(e, dragging, hand) {},
  //   onDrop(e, dropping, hand) {},
  // });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      // check for drop
      (() => {
        if (!draggingInfo?.cards.length) return;
        if (!handRef.current) return;
        if (!placeholderRef.current) return;

        const handBounds = handRef.current.getBoundingClientRect();
        const mousePosition = { x: e.clientX, y: e.clientY };
        if (!pointInRect(mousePosition, handBounds)) {
          placeholderRef.current.style.display = "none";
          return;
        }

        // we're hovering
        const handCards =
          handRef.current.querySelectorAll(".handCardContainer");
        Array.from(handCards).find((handCard) => {
          const handCardBounds = handCard.getBoundingClientRect();
          if (mousePosition.x < handCardBounds.x + handCardBounds.width / 2) {
            placeholderRef.current!.style.display = "block";
            return true;
          }
        });
      })();

      // check for drag
      (() => {
        if (mouseDownCardIndex.current === null) return;
        if (mouseMovingCardIndex.current !== null) return;
        if (!cards[mouseDownCardIndex.current]) return;

        mouseMovingCardIndex.current = mouseDownCardIndex.current;
        const indexToRemove = mouseMovingCardIndex.current;
        setDraggingInfo({
          cards: [
            {
              id: cards[mouseMovingCardIndex.current]!,
              context: { originalIndex: mouseMovingCardIndex.current },
              source: "hand",
            },
          ],
          sourceCleanup(destination, context) {
            setCards((cards) => arrayWithoutIndex(cards, indexToRemove));
          },
        });
      })();
    }

    function handleMouseUp(e: MouseEvent) {
      mouseMovingCardIndex.current = mouseDownCardIndex.current = null;
      setDraggingInfo(null);
    }

    document.addEventListener("mousemove", handleMouseMove);
    addOrderedEventListener(window, "mouseup", handleMouseUp, 0);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      removeOrderedEventListener(window, "mouseup", handleMouseUp, 0);
    };
  }, [cards, setCards, draggingInfo?.cards.length, setDraggingInfo]);

  return (
    <>
      <div
        className={`align-start ${
          !!flipped && "h-[40%]"
        } relative flex min-h-0 flex-row justify-start gap-0`}
      >
        {closeupCardIndex !== null && cards[closeupCardIndex] && (
          <CardCloseup
            cardId={cards[closeupCardIndex]}
            onClose={() => setCloseupCardIndex(null)}
            onNavigateNext={() =>
              closeupCardIndex < cardsInHand - 1 &&
              setCloseupCardIndex(closeupCardIndex + 1)
            }
            onNavigatePrev={() =>
              closeupCardIndex > 0 && setCloseupCardIndex(closeupCardIndex - 1)
            }
          />
        )}
        <div className="sideways mr-2 bg-white bg-opacity-75 py-1">Hand</div>
        <div
          ref={handRef}
          className="align-start relative flex min-h-0 grow flex-row justify-start gap-0"
        >
          <div
            ref={placeholderRef}
            className="background-black fixed hidden opacity-50"
          >
            &nbsp;
          </div>
          {cards.map((card, i) => (
            <Card
              hideFavIcon
              key={card}
              id={card || undefined}
              back={flipped}
              onHoverChange={(hovered) => {
                setHoveredCardIndex((h) => (hovered ? i : i === h ? null : h));
              }}
              containerProps={{
                className: `${flipped ? "hover:top-2" : `hover:bottom-4`} ${
                  !flipped &&
                  draggingInfo &&
                  draggingInfo.cards.some(
                    (c) =>
                      c.source === "hand" && c.context?.originalIndex === i,
                  )
                    ? "hidden"
                    : ""
                } cursor-pointer handCardContainer hover:scale-[1.05] max-h-full grow-0 shrink-0 relative -mr-10`,
              }}
              cardProps={{
                onMouseDown: (e) => handleCardMouseDown(e.nativeEvent, i),
                onContextMenu: (e) => {
                  e.preventDefault();
                  setCloseupCardIndex(i);
                },
                className: "h-full min-h-0 min-w-0",
                style: {
                  zIndex:
                    i === hoveredCardIndex
                      ? cardsInHand
                      : (i <= pivotCardIndex ? i : pivotCardIndex * 2 - i) + 1,
                },
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
