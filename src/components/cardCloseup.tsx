import { Deck, exportDeck } from "@/lib/deck";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import cards from "../resources/cards";
import sets from "../resources/sets";
import types from "../resources/types";
import Card, { CardHeight, CardWidth } from "./card";
import TypeWithHint from "./typeWithHint";

interface Props {
  cardId: string;
  onClose: () => any;
  onNavigatePrev?: () => any;
  onNavigateNext?: () => any;
}

export default function CardCloseup(props: Props) {
  const { cardId, onClose, onNavigatePrev, onNavigateNext } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardDisplaySize, setCardDisplaySize] = useState({
    width: 0,
    height: 0,
  });

  const card = useMemo(() => cards[cardId], [cardId]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      console.log(e.key);
      if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {
        onClose();
      } else if (e.key === "ArrowLeft") {
        onNavigatePrev && onNavigatePrev();
      } else if (e.key === "ArrowRight") {
        onNavigateNext && onNavigateNext();
      }
    };
    document.addEventListener("keydown", fn);

    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  useLayoutEffect(() => {
    const onResize = () => {
      if (!containerRef.current) return;

      const size = containerRef.current.getBoundingClientRect();
      const heightRatio = size.height / CardHeight;
      const cardDisplayWidth = CardWidth * heightRatio;
      const cardDisplayHeight = size.height;
      setCardDisplaySize({
        width: cardDisplayWidth,
        height: cardDisplayHeight,
      });
    };

    onResize();

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [setCardDisplaySize]);

  return (
    <div
      ref={containerRef}
      onClick={onClose}
      className="absolute left-0 top-0 z-10 flex h-[100%] w-[100%] flex-row bg-[rgba(0,0,0,0.5)] p-8"
    >
      <Card
        containerClassName="shrink-0"
        className="h-full"
        id={cardId}
        onClick={(e) => e.stopPropagation()}
        large
        cardProps={{
          width: cardDisplaySize.width,
          height: cardDisplaySize.height,
        }}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex grow flex-col gap-2 bg-white p-2 px-4"
      >
        <div className="mb-2 flex flex-row items-center">
          <h2 className="text-3xl">{card.name}</h2>
          <button onClick={() => onClose()} className="ml-auto border p-1">
            [Close]
          </button>
        </div>
        <div className="flex grow flex-col gap-2 overflow-auto">
          {card.text && <h3 className="">{card.text}</h3>}
          {<h3 className="text-2xl">Card Type: {card.superType}</h3>}
          {card.subTypes.length > 0 && (
            <h3 className="text-2xl">
              Card Subtypes: {card.subTypes.join(", ")}
            </h3>
          )}
          {card.types && (
            <h3 className="text-2xl">
              Types:{" "}
              {card.types.map((t) => (
                <TypeWithHint type={t as keyof typeof types} key={t} />
              ))}
            </h3>
          )}
          {card.hp && <h3 className="text-2xl">HP: {card.hp}</h3>}
          {card.abilities && (
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl">Abilities</h3>
              <ul className="list-disc pl-5">
                {card.abilities.map((ability) => (
                  <li key={ability.name}>
                    <h4 className="text-xl">
                      {ability.type}: {ability.name}
                    </h4>
                    <div>{ability.text}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {card.moves && (
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl">Moves</h3>
              <ul className="list-disc pl-5">
                {card.moves.map((move) => (
                  <li key={move.name}>
                    <h4 className="text-xl">{move.name}</h4>
                    <div>
                      Cost:{" "}
                      {move.cost.map((w: any) => (
                        <TypeWithHint type={w as keyof typeof types} />
                      ))}
                    </div>
                    {move.damage && <div>Damage: {move.damage}</div>}
                    {move.text && <div>{move.text}</div>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {card.weaknesses && (
            <h3 className="text-2xl">
              Weaknesses:{" "}
              {card.weaknesses.map((w) => (
                <>
                  <span>
                    <TypeWithHint type={w.type as keyof typeof types} /> (
                    {w.value})
                  </span>
                  <span className="last:hidden">{", "}</span>
                </>
              ))}
            </h3>
          )}
          {card.resistances && (
            <h3 className="text-2xl">
              Resistances:{" "}
              {card.resistances.map((w) => (
                <>
                  <span>
                    <TypeWithHint type={w.type as keyof typeof types} /> (
                    {w.value})
                  </span>
                  <span className="last:hidden">{", "}</span>
                </>
              ))}
            </h3>
          )}
          {card.retreatCost !== undefined && (
            <h3 className="text-2xl">Retreat Cost: {card.retreatCost}</h3>
          )}
        </div>
      </div>
    </div>
  );
}
