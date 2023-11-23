import { useMemo, useState } from "react";
import CardCloseup from "./cardCloseup";
import DeckCard from "./deckCard";

interface CardSlot {
  cardId: string;
  amount: number;
}

interface Props {
  cards: CardSlot[];
  setCards: (cards: CardSlot[]) => any;
}

export default function Deck(props: Props) {
  const { cards, setCards } = props;
  const [popupCardId, setPopupCardId] = useState<string | null>(null);

  const totalCards = useMemo(
    () => cards.reduce((acc, card) => acc + card.amount, 0),
    [cards],
  );

  function add(id: string) {
    setCards(
      cards.map((c) => (c.cardId === id ? { ...c, amount: c.amount + 1 } : c)),
    );
  }

  function remove(id: string) {
    const card = cards.find((c) => c.cardId === id);
    if (!card) return;

    if (card.amount === 1) {
      setCards(cards.filter((c) => c.cardId !== id));
    } else {
      setCards(
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
      <div className="flex min-h-0 min-w-[15vw] max-w-[15vw] flex-col gap-1">
        <h2 className="text-xl">Deck ({totalCards}/60)</h2>
        {props.cards.length === 0 && <>Add some cards perhaps...</>}
        {props.cards.length > 0 && (
          <div className="overflow-auto border">
            {props.cards.map((card) => (
              <DeckCard
                key={card.cardId}
                cardId={card.cardId}
                amount={card.amount}
                add={() => add(card.cardId)}
                remove={() => remove(card.cardId)}
                onClick={() => setPopupCardId(card.cardId)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
