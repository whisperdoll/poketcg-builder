import Card from "@/components/card";
import CardCloseup from "@/components/cardCloseup";
import Deck from "@/components/deck";
import DraftSelect from "@/components/draft-select";
import useLocalStorage from "@/hooks/useLocalStorage";
import cx from "@/lib/cx";
import type { DeckSave, Deck as IDeck } from "@/lib/deck";
import {
  addToDeck,
  cardsFromDeck,
  deckFromCards,
  exportDeck,
} from "@/lib/deck";
import type { Filters } from "@/lib/filters";
import { DEFAULT_FILTERS, filteredCards } from "@/lib/filters";
import {
  arrayFromGenerator,
  infiniteShuffledGenerator,
  splitmix32,
  tryParseInt,
} from "@/lib/utils";
import type { ICard } from "@/resources/cards";
import cards from "@/resources/cards";
import { faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";

type Board = { card: ICard; added: boolean }[];

export default function Draft() {
  const [searchParams, _setSearchParams] = useSearchParams();
  const deckSize = parseInt(searchParams.get("decksize") || "40");
  const [round, setRound] = useState(0);
  const restrictEvos = searchParams.get("restrictEvos") === "true";
  const numRounds = tryParseInt(searchParams.get("rounds"), deckSize / 2);
  const numPokemon = tryParseInt(searchParams.get("pokemon"), 4);
  const numTrainers = tryParseInt(searchParams.get("trainers"), 2);
  const numPicks = tryParseInt(searchParams.get("picks"), 2);
  const filters = JSON.parse(
    searchParams.get("filters") || JSON.stringify(DEFAULT_FILTERS),
  ) as Filters;
  const seed = tryParseInt(searchParams.get("seed"), 0);
  const rngGenerator = useMemo(() => splitmix32(seed), [seed]);
  const [popupCardIndex, setPopupCardIndex] = useState<number>(-1);
  const [addedCards, setAddedCards] = useState<IDeck>([]);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const [_decks, setDecks] = useLocalStorage<DeckSave[]>("decks", []);
  const decks = _decks || [];

  const [pokemon, trainers] = useMemo(() => {
    const [pokemon, trainers]: [ICard[], ICard[]] = [[], []];
    const filtered = filteredCards(filters);
    filtered.forEach((card) => {
      if (card.superType === "POKEMON") {
        pokemon.push(card);
      } else if (card.superType === "TRAINER") {
        trainers.push(card);
      }
    });
    return [pokemon, trainers];
  }, [filters]);

  const drawPokemonShuffler = useMemo(
    () => infiniteShuffledGenerator(pokemon, rngGenerator),
    [pokemon, rngGenerator],
  );

  const drawPokemon = useCallback(() => {
    while (true) {
      const pokemon = drawPokemonShuffler();
      if (!restrictEvos || !pokemon.evolvesFrom) return pokemon;

      const hasPreEvo = addedCards.some(
        (c) => cards[c.cardId].name === pokemon.evolvesFrom,
      );
      if (hasPreEvo) {
        return pokemon;
      }
    }
  }, [drawPokemonShuffler, addedCards, restrictEvos]);

  const drawTrainer = useMemo(
    () => infiniteShuffledGenerator(trainers, rngGenerator),
    [trainers, rngGenerator],
  );

  function generateBoard(): Board {
    return [
      ...arrayFromGenerator(drawPokemon, numPokemon),
      ...arrayFromGenerator(drawTrainer, numTrainers),
    ].map((card) => ({ card, added: false }));
  }

  const [boardState, setBoardState] = useState<Board>(generateBoard);
  const numPicked = boardState.reduce((acc, slot) => acc + +slot.added, 0);

  function navigatePrev() {
    const currentIndex = popupCardIndex;
    if (currentIndex === -1) return;
    setPopupCardIndex(
      popupCardIndex === 0 ? boardState.length - 1 : popupCardIndex - 1,
    );
  }

  function navigateNext() {
    const currentIndex = popupCardIndex;
    if (currentIndex === -1) return;
    setPopupCardIndex(
      popupCardIndex === boardState.length - 1 ? 0 : popupCardIndex + 1,
    );
  }

  function saveAndGoToDeckBuilder(deck: IDeck) {
    const date = new Date();
    const dateString = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    const name = `Draft ${dateString}`;
    setDecks([
      ...decks,
      {
        cards: deck,
        name,
        formats: filters.formats,
      },
    ]);
    navigate(`/?name=${encodeURIComponent(name)}`);
  }

  function gotoNextRound() {
    setAddedCards(
      addToDeck(
        addedCards,
        ...boardState.filter((b) => b.added).map((b) => b.card.id),
      ),
    );

    if (round + 1 === numRounds) {
      if (numPicks * numRounds <= deckSize) {
        // no use in making them select every single card lol
        saveAndGoToDeckBuilder(addedCards);
      } else {
        setDone(true);
      }
    } else {
      setRound(round + 1);
      setBoardState(generateBoard());
    }
  }

  function togglePick(i: number) {
    if (boardState[i].added) {
      setBoardState([
        ...boardState.slice(0, i),
        { ...boardState[i], added: false },
        ...boardState.slice(i + 1),
      ]);
    } else {
      if (numPicked === numPicks) return;
      setBoardState([
        ...boardState.slice(0, i),
        { ...boardState[i], added: true },
        ...boardState.slice(i + 1),
      ]);
    }
  }

  const addedCardsAsCards = useMemo(
    () => cardsFromDeck(addedCards).map((cid) => cards[cid]),
    [addedCards],
  );

  return done ? (
    <DraftSelect
      cards={addedCardsAsCards}
      max={deckSize}
      onFinish={(cards) =>
        saveAndGoToDeckBuilder(deckFromCards(cards.map((c) => c.id)))
      }
    />
  ) : (
    <div className="flex h-full w-full flex-row gap-4 overflow-hidden p-4">
      <div className="flex flex-col gap-4">
        <h1>
          Round {round + 1}/{numRounds} ✦ {numPicks} picks
        </h1>
        <button
          className="border p-1"
          disabled={numPicked !== numPicks}
          onClick={gotoNextRound}
        >
          Add and go to next round <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <div className="flex flex-row flex-wrap gap-4">
          {boardState.map(({ card, added }, i) => (
            <Card
              id={card.id}
              key={card.id}
              containerProps={{
                className:
                  "relative transform cursor-pointer transition-transform duration-200 hover:scale-[1.02] h-80",
              }}
              cardProps={{
                className: cx("h-full w-auto"),
                onClick: () => togglePick(i),

                onContextMenu: (e) => {
                  e.preventDefault();
                  setPopupCardIndex(i);
                },
              }}
            >
              {!!added && (
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
              )}
            </Card>
          ))}
        </div>
      </div>

      <div className="flex grow flex-row justify-start gap-4">
        <div className="flex flex-col border px-1">
          <Deck cards={addedCards} fixed maxSize={numRounds * numPicks} />
        </div>
      </div>

      {popupCardIndex !== -1 && (
        <CardCloseup
          cardId={boardState[popupCardIndex].card.id}
          onClose={() => setPopupCardIndex(-1)}
          onNavigateNext={navigateNext}
          onNavigatePrev={navigatePrev}
        />
      )}
    </div>
  );
}
