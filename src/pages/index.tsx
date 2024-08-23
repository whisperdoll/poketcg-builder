import Card from "@/components/card";
import cards from "../resources/cards";
import sets from "../resources/sets";
import Filters from "@/components/filters";
import { useCallback, useEffect, useState } from "react";
import Deck from "@/components/deck";
import CardGallery from "@/components/cardGallery";
import { DEFAULT_FILTERS } from "@/lib/filters";
import ImportExportPopup from "@/components/importExportPopup";
import useLocalStorage from "@/hooks/useLocalStorage";
import { CardId, sortDeck } from "@/lib/deck";

type Deck = { cardId: string; amount: number }[];
type DeckSave = { name: string; cards: Deck; format: string | undefined };

export default function Index() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [deck, _setDeck] = useState<Deck>([]);
  const [currentDeckName, setCurrentDeckName] = useState<string | undefined>(
    undefined,
  );
  const [currentDeckEditableName, setCurrentDeckEditableName] =
    useState<string>("");
  const [showExport, setShowExport] = useState(false);
  const [_decks, setDecks] = useLocalStorage<DeckSave[]>("decks", []);
  const decks = _decks || [];
  const [_favorites, setFavorites] = useLocalStorage<CardId[]>("favorites", []);
  const favorites = _favorites || [];
  const [touched, setTouched] = useState(false);

  const setDeck = useCallback(
    (deck: Deck | ((prev: Deck) => Deck), touch: boolean = true) => {
      _setDeck(deck);
      if (touch) setTouched(true);
    },
    [_setDeck],
  );

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

  function save() {
    if (!currentDeckEditableName) {
      alert("You need to give the deck a name");
      return;
    }

    if (currentDeckName) {
    } else {
    }

    //

    const foundIndex = currentDeckName
      ? decks.findIndex((d) => d.name === currentDeckName)
      : -1;
    const foundEditableNameIndex = decks.findIndex(
      (d) => d.name === currentDeckEditableName,
    );

    let writeToIndex = foundIndex;

    const isOverwriting =
      currentDeckName !== currentDeckEditableName &&
      foundEditableNameIndex !== -1;
    if (isOverwriting) {
      const wantsToOverwrite = confirm(
        `A deck with the name ${currentDeckEditableName} already exists. Do you want to overwrite it?`,
      );
      if (!wantsToOverwrite) return;
      writeToIndex = foundEditableNameIndex;
    }

    if (writeToIndex === -1) {
      setDecks([
        ...decks,
        {
          name: currentDeckEditableName,
          cards: sortDeck(deck),
          format: filters.format,
        },
      ]);
    } else {
      const copy = [...decks];
      copy[writeToIndex] = {
        name: currentDeckEditableName,
        cards: sortDeck(deck),
        format: filters.format,
      };
      setDecks(copy);
    }

    setTouched(false);
    setCurrentDeckName(currentDeckEditableName);
  }

  function selectDeck(name: string) {
    // TODO: prompt if touched
    if (touched) {
      const wantsToLeave = confirm(
        "Your current deck has unsaved changes. Are you sure you want to switch decks?",
      );
      if (!wantsToLeave) return;
    }

    const foundDeck = decks.find((d) => d.name === name);
    setCurrentDeckName(name);
    setCurrentDeckEditableName(name);
    setDeck(sortDeck(foundDeck?.cards || []), false);
    setFilters({
      ...filters,
      format: foundDeck?.format,
    });
    setTouched(false);
  }

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
        <div className="flex min-w-[15vw] max-w-[15vw] flex-col gap-4">
          <select
            className="border p-1"
            value={currentDeckName}
            onChange={(e) => selectDeck(e.currentTarget.value)}
          >
            <option value="">
              New Deck{!currentDeckName && touched ? "*" : ""}
            </option>
            {decks.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}
                {d.name === currentDeckName && touched ? "*" : ""}
              </option>
            ))}
          </select>
          <input
            className="border p-1"
            value={currentDeckEditableName}
            onChange={(e) => setCurrentDeckEditableName(e.currentTarget.value)}
            placeholder="Deck Name"
          />
          <button className="border p-1" onClick={save}>
            Save
          </button>
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
