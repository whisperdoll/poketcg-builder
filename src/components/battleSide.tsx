import cards from "@/resources/cards";
import BattleDeck from "./battleDeck";
import Card from "./card";
import { useContext, useMemo, useRef, useState } from "react";
import { arrayFromGenerator, infiniteShuffledGenerator } from "@/lib/utils";
import BattleHand from "./battleHand";
import type { CardId } from "@/lib/deck";
import { DraggingContext } from "@/contexts/DraggingContext";

import BattleBench from "./battleBench";
import { CardHoverContext } from "@/contexts/CardHoverContext";

type Props = {
  className?: string;
  flipped?: boolean;
};

export default function BattleSide({ className, flipped }: Props) {
  const randomGen = useMemo(
    () =>
      infiniteShuffledGenerator(
        Array(50)
          .fill(0)
          .map((_, i) => `110-${i + 1}`),
      ),
    [],
  );

  const [active, setActive] = useState(() => arrayFromGenerator(randomGen, 1));
  const [bench, setBench] = useState(() => arrayFromGenerator(randomGen, 3));
  const [hand, setHand] = useState<(string | null)[]>(() =>
    arrayFromGenerator(randomGen, 5),
  );
  const [hoveredCard, setHoveredCard] = useContext(CardHoverContext);
  const [draggingInfo, setDraggingInfo] = useContext(DraggingContext);
  const activeRef = useRef<HTMLDivElement>(null);
  const benchRef = useRef<HTMLDivElement>(null);
  const [benchHovered, setBenchHovered] = useState(false);
  const cardHoverRef = useRef<HTMLDivElement>(null);

  function handleCardHoverChanged(cardId: CardId, hovered: boolean) {
    // setHoveredCard((prev) =>
    //   hovered ? cardId : cardId === prev ? null : prev,
    // );
  }

  return (
    <div className={"relative flex min-h-0 flex-row gap-2 " + className || ""}>
      <div className="flex min-h-0 flex-col gap-2">
        <BattleDeck label="Deck" deck={[{ is: Object.keys(cards)[0] }]} />
        <BattleDeck label="Discard" deck={[]} />
      </div>
      <div
        className={`flex grow gap-2 overflow-hidden ${
          flipped ? "flex-col-reverse" : "flex-col"
        }`}
      >
        <div className="flex h-[69%] min-h-0 flex-row gap-2">
          <div className="sideways bg-white bg-opacity-75 py-1">Play Area</div>
          <div ref={activeRef} className="flex shrink-0 flex-row gap-2">
            {active.map((id, i) => (
              <Card
                hideFavIcon
                id={id}
                key={`${id}-${i}`}
                cardProps={{
                  className: `activeCard h-full min-h-0 activeCard-${i}`,
                }}
              />
            ))}
          </div>
          <BattleBench
            bench={bench}
            setBench={setBench}
            isFlipped={!!flipped}
          />
        </div>
        <BattleHand cards={hand} setCards={setHand} flipped={flipped} />
      </div>
    </div>
  );
}
