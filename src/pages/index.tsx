import Filters from "@/components/filters";
import { useCallback, useRef, useState } from "react";
import DeckComponent from "@/components/deck";
import CardGallery from "@/components/cardGallery";
import { DEFAULT_FILTERS } from "@/lib/filters";
import ImportExportPopup from "@/components/importExportPopup";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { CardId, Deck, DeckSave } from "@/lib/deck";
import { addToDeck, sortDeck } from "@/lib/deck";
import { useSearchParams } from "react-router";

export default function Index() {
  const [queryParams, setQueryParams] = useSearchParams();
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
  const setInitialDeck = useRef(false);

  const setDeck = useCallback(
    (deck: Deck | ((prev: Deck) => Deck), touch: boolean = true) => {
      _setDeck(deck);
      if (touch) setTouched(true);
    },
    [_setDeck],
  );

  const addCard = useCallback(
    (id: string) => {
      setDeck((deck) => addToDeck(deck, id));
    },
    [setDeck],
  );

  function save() {
    if (!currentDeckEditableName) {
      alert("You need to give the deck a name");
      return;
    }

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
          formats: filters.formats,
        },
      ]);
    } else {
      const copy = [...decks];
      copy[writeToIndex] = {
        name: currentDeckEditableName,
        cards: sortDeck(deck),
        formats: filters.formats,
      };
      setDecks(copy);
    }

    setTouched(false);
    setCurrentDeckName(currentDeckEditableName);
  }

  function selectDeck(name: string) {
    if (touched) {
      const wantsToLeave = confirm(
        "Your current deck has unsaved changes. Are you sure you want to switch decks?",
      );
      if (!wantsToLeave) return;
    }

    const foundDeck = decks.find((d) => d.name === name);
    if (!foundDeck) {
      // new deck
      setCurrentDeckName(undefined);
      setCurrentDeckEditableName("");
      setDeck([]);
      setTouched(false);
      return;
    }

    setCurrentDeckName(name);
    setCurrentDeckEditableName(name);
    setDeck(sortDeck(foundDeck?.cards || []), false);

    const legacyFoundDeck = foundDeck as typeof foundDeck & { format?: string };
    if (legacyFoundDeck.format && !legacyFoundDeck.formats) {
      legacyFoundDeck.formats = [legacyFoundDeck.format];
    }

    setFilters({
      ...filters,
      formats: legacyFoundDeck.formats,
    });
    setTouched(false);
  }

  if (!setInitialDeck.current) {
    setInitialDeck.current = true;
    if (queryParams.has("name")) {
      selectDeck(queryParams.get("name")!);
    }
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
          <DeckComponent cards={deck} setCards={setDeck} />
        </div>
        <div className="flex flex-col gap-4">
          <Filters filters={filters} setFilters={setFilters}>
            <div slot="after">ℹ️ Click a card below to add it to your deck</div>
            <div slot="after">ℹ️ Right-click a card to view it up close</div>
          </Filters>
          <CardGallery filters={filters} addCard={addCard} />
        </div>
      </div>
    </>
  );
}
