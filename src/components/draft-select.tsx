import { DEFAULT_FILTERS } from "@/lib/filters";
import CardGallery from "./cardGallery";
import type { ICard } from "@/resources/cards";
import { useMemo, useState } from "react";
import type { CardId } from "@/lib/deck";
import cx from "@/lib/cx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface Props {
  cards: ICard[];
  max: number;
  onFinish: (selectedCards: ICard[]) => unknown;
}

export default function DraftSelect(props: Props) {
  const { cards, max, onFinish } = props;
  const [toggleStates, setToggleStates] = useState(() =>
    cards.map(() => false),
  );
  const numSelected = useMemo(
    () => toggleStates.count((s) => s),
    [toggleStates],
  );

  function toggleCardSelect(cardId: CardId, index: number) {
    setToggleStates((p) => p.withIndexReplaced(index, (old) => !old));
  }

  function finish() {
    onFinish(cards.filter((_, i) => toggleStates[i]));
  }

  return (
    <div className="flex flex-col gap-1 h-full">
      <h1 className="flex items-center p-1 px-2">
        <span>
          Pick your cards! ({numSelected}/{max})
        </span>
        <button
          onClick={finish}
          disabled={numSelected !== max}
          className="border p-1 ml-auto"
        >
          <FontAwesomeIcon icon={faCheck} />
          Done
        </button>
      </h1>
      <CardGallery
        filters={DEFAULT_FILTERS}
        cards={cards}
        addCard={toggleCardSelect}
        cardProps={(c, i) => ({
          children: toggleStates[i] ? (
            <>
              <div className="pointer-events-none absolute flex h-full w-full items-center justify-center bg-green-500/50">
                <FontAwesomeIcon
                  icon={faCheck}
                  size="6x"
                  color="green"
                  style={{
                    stroke: "black",
                    strokeWidth: "4px",
                  }}
                />
              </div>
            </>
          ) : null,
          cardProps: {
            className: cx("h-full w-auto"),
          },
          containerProps: {
            className: "relative h-78",
          },
        })}
      />
    </div>
  );
}
