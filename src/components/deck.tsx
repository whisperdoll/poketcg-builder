import { useMemo, useState } from "react";
import CardCloseup from "./cardCloseup";
import DeckCard from "./deckCard";
import { countDeck, sortDeck } from "@/lib/deck";

interface CardSlot {
  cardId: string;
  amount: number;
}

type Props =
  | {
      cards: CardSlot[];
      title?: string;
      setCards: (cards: CardSlot[]) => any;
      fixed?: false;
    }
  | {
      cards: CardSlot[];
      title?: string;
      fixed: true;
    };

export default function Deck(props: Props) {
  const { cards, fixed } = props;
  const [popupCardId, setPopupCardId] = useState<string | null>(null);

  const totalCards = useMemo(() => countDeck(cards), [cards]);
  const sortedCards = useMemo(() => sortDeck(cards), [cards]);

  const title = props.title || `Deck (${totalCards}/60)`;

  function add(id: string) {
    if (props.fixed) return;

    props.setCards(
      cards.map((c) => (c.cardId === id ? { ...c, amount: c.amount + 1 } : c)),
    );
  }

  function remove(id: string) {
    if (props.fixed) return;

    const card = cards.find((c) => c.cardId === id);
    if (!card) return;

    if (card.amount === 1) {
      props.setCards(cards.filter((c) => c.cardId !== id));
    } else {
      props.setCards(
        cards.map((c) =>
          c.cardId === id ? { ...c, amount: c.amount - 1 } : c,
        ),
      );
    }
  }

  return (
    <>
      {popupCardId && (
        <CardCloseup
          cardId={popupCardId}
          onClose={() => setPopupCardId(null)}
        />
      )}
      <div className="flex min-h-0 flex-col gap-1">
        <h2 className="text-xl">{title}</h2>
        {props.cards.length === 0 && <>Add some cards perhaps...</>}
        {props.cards.length > 0 && (
          <div className="overflow-auto border">
            {sortedCards.map((card) => (
              <DeckCard
                key={card.cardId}
                cardId={card.cardId}
                amount={card.amount}
                add={fixed ? undefined : () => add(card.cardId)}
                remove={fixed ? undefined : () => remove(card.cardId)}
                onClick={() => setPopupCardId(card.cardId)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
