import Card from "@/components/card";
import cards from "../resources/cards";
import sets from "../resources/sets";
import Filters from "@/components/filters";
import { useCallback, useState } from "react";
import Deck from "@/components/deck";
import CardGallery from "@/components/cardGallery";
import { DEFAULT_FILTERS } from "@/lib/filters";
import ImportExportPopup from "@/components/importExportPopup";

type Deck = { cardId: string; amount: number }[];

export default function Index() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [deck, setDeck] = useState<Deck>([]);
  const [showExport, setShowExport] = useState(false);

  const addCard = useCallback(
    (id: string) => {
      setDeck((deck) => {
        const existing = deck.some((c) => c.cardId === id);

        if (existing) {
          return deck.map((c) =>
            c.cardId === id ? { cardId: id, amount: c.amount + 1 } : c,
          );
        } else {
          return [...deck, { cardId: id, amount: 1 }];
        }
      });
    },
    [setDeck],
  );

  return (
    <>
      {showExport && (
        <ImportExportPopup
          deck={deck}
          onClose={() => setShowExport(false)}
          onAccept={(deck) => {
            setDeck(deck);
            setShowExport(false);
          }}
        />
      )}
      <div className="flex h-full w-full flex-row gap-4 overflow-hidden p-4">
        <div className="flex flex-col gap-4">
          <button className="border p-1" onClick={() => setShowExport(true)}>
            Import / Export
          </button>
          <Deck cards={deck} setCards={setDeck} />
        </div>
        <div className="flex flex-col gap-4">
          <Filters filters={filters} setFilters={setFilters} />
          <CardGallery filters={filters} addCard={addCard} />
        </div>
      </div>
    </>
  );
}
