import { useEffect, useRef, useState } from "react";
import BattleSide from "@/components/battleSide";
import type { DraggingContextType } from "@/contexts/DraggingContext";
import { DraggingContext } from "@/contexts/DraggingContext";
import Card from "@/components/card";

export default function Battle() {
  const [dragging, setDragging] = useState<DraggingContextType | null>(null);
  const draggingRef = useRef<HTMLDivElement>(undefined);
  const draggingCard = dragging?.cards.at(0);

  useEffect(() => {
    function mouseMove(e: MouseEvent) {
      if (!draggingRef.current) return;

      const width = draggingRef.current.clientWidth;
      const height = draggingRef.current.clientHeight;

      draggingRef.current.style.left = `${e.clientX - width / 2}px`;
      draggingRef.current.style.top = `${e.clientY - height / 2}px`;
    }

    document.addEventListener("mousemove", mouseMove);
    return () => document.removeEventListener("mousemove", mouseMove);
  }, []);

  return (
    <DraggingContext.Provider value={[dragging, setDragging]}>
      <div className="flex h-full w-full flex-row gap-4 overflow-hidden p-4">
        {draggingCard && (
          <Card
            id={draggingCard.id}
            containerRef={draggingRef}
            containerProps={{
              className: "fixed z-[1000]",
            }}
            cardProps={{
              className: "h-[15vh] opacity-[100%]",
            }}
            hideFavIcon
          />
        )}
        <div className="flex flex-col border">sidebar</div>
        <div className="battleMat grow border">
          <BattleSide className="h-[42%] p-2" flipped />
          <div className="flex h-2 h-[2%] flex-row items-center">
            <div className="h-px w-full bg-white bg-opacity-30"></div>
          </div>
          <BattleSide className="grow-2 h-[56%] p-2" />
        </div>
      </div>
    </DraggingContext.Provider>
  );
}
