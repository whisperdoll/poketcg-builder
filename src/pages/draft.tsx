import Card from "@/components/card";
import Deck from "@/components/deck";
import useStateAsyncInit from "@/hooks/useStateAsyncInit";
import { addToDeck, exportDeck, Deck as IDeck } from "@/lib/deck";
import {
  arrayFromGenerator,
  infiniteShuffledGenerator,
  splitmix32,
  tryParseInt,
} from "@/lib/utils";
import cards, { ICard } from "@/resources/cards";
import formats from "@/resources/formats";
import sets from "@/resources/sets";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useReducer, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

type Board = { card: ICard; selectedBy: string | null }[];

export default function Draft() {
  const { format: formatId, seed } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const deckSize = parseInt(searchParams.get("decksize") || "40");
  const [round, setRound] = useState(0);
  const numRounds = tryParseInt(searchParams.get("rounds"), 2);
  const numPokemon = tryParseInt(searchParams.get("pokemon"), 4);
  const numTrainers = tryParseInt(searchParams.get("trainers"), 2);
  const numPlayers = tryParseInt(searchParams.get("players"), 2);
  const numPicksPerPlayer = tryParseInt(searchParams.get("picks"), 2);
  const numPicksPerRound = numPicksPerPlayer * numPlayers;
  const format = formats[formatId?.toUpperCase() || ""];
  const rngGenerator = useMemo(() => splitmix32(parseInt(seed!)), [seed]);
  const [boardState, setBoardState] = useState<Board>([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null,
  );
  const selectedCardId =
    selectedCardIndex === null ? null : boardState[selectedCardIndex].card.id;
  const [playerTurn, setPlayerTurn] = useState(0);
  const [playerDecks, setPlayerDecks] = useStateAsyncInit<IDeck[]>(() =>
    arrayFromGenerator<IDeck>(() => [], numPlayers),
  );
  const [done, setDone] = useState(false);

  function initBoard() {
    setBoardState(generateBoard());
  }
  useEffect(initBoard, []);

  function gotoNextRound() {
    if (round + 1 === numRounds) {
      setDone(true);
    } else {
      setRound(round + 1);
      setBoardState(generateBoard());
    }
  }

  function pickSelectedCard() {
    if (selectedCardIndex === null) return;

    const selectedBy = `Player ${playerTurn + 1}`;
    const picksSoFar =
      boardState.reduce((acc, slot) => acc + (slot.selectedBy ? 1 : 0), 0) + 1;
    const isLastPick = picksSoFar === numPicksPerRound;

    setPlayerDecks([
      ...playerDecks.slice(0, playerTurn),
      addToDeck(playerDecks[playerTurn], selectedCardId!),
      ...playerDecks.slice(playerTurn + 1),
    ]);
    setPlayerTurn((playerTurn + 1) % numPlayers);

    if (isLastPick) {
      gotoNextRound();
    } else {
      setBoardState([
        ...boardState.slice(0, selectedCardIndex),
        { ...boardState[selectedCardIndex], selectedBy },
        ...boardState.slice(selectedCardIndex + 1),
      ]);
    }
  }

  function generateBoard(): Board {
    return [
      ...arrayFromGenerator(drawPokemon, numPokemon),
      ...arrayFromGenerator(drawTrainer, numTrainers),
    ].map((card) => ({ card, selectedBy: null }));
  }

  const matchesFormat = (card: ICard) => {
    const set = sets[card.id.split("-")[0]];
    return (
      !format ||
      (!format.excludes.includes(card.id) &&
        (format.expansions.map((e) => e.toString()).includes(set.id) ||
          format.includes.includes(card.id)))
    );
  };

  const [pokemon, trainers] = useMemo(() => {
    const [pokemon, trainers]: [ICard[], ICard[]] = [[], []];
    Object.values(cards).forEach((card) => {
      if (!matchesFormat(card)) return;

      if (card.superType === "POKEMON") {
        pokemon.push(card);
      } else if (card.superType === "TRAINER") {
        trainers.push(card);
      }
    });
    return [pokemon, trainers];
  }, [format]);

  const drawPokemon = useMemo(
    () => infiniteShuffledGenerator(pokemon, rngGenerator),
    [pokemon, rngGenerator],
  );
  const drawTrainer = useMemo(
    () => infiniteShuffledGenerator(trainers, rngGenerator),
    [trainers, rngGenerator],
  );

  return done ? (
    <div className="flex h-full w-full flex-row gap-4 p-4">
      {playerDecks.map((deck, i) => {
        return (
          <div key={i} className="flex grow flex-col">
            <div>Player {i + 1}</div>
            <textarea className="grow border" value={exportDeck(deck)} />
          </div>
        );
      })}
    </div>
  ) : (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden p-4">
      <h1>
        Round {round}/{numRounds}, Player {playerTurn + 1} to choose
      </h1>
      <div className="flex max-h-[30%] flex-row gap-4">
        {boardState.map(({ card, selectedBy }, i) => (
          <Card
            id={card.id}
            key={card.id}
            onClick={() => setSelectedCardIndex(i)}
            cardProps={{ className: "h-full w-auto" }}
            style={{
              filter: !!selectedBy ? "grayscale(1) brightness(0.5)" : undefined,
            }}
          />
        ))}
      </div>
      <div className="flex min-h-0 flex-row gap-4">
        {selectedCardIndex !== null && (
          <>
            <Card
              id={selectedCardId!}
              large
              cardProps={{ className: "h-full w-auto" }}
            />
            <div className="flex grow items-center justify-start">
              <button
                className="border px-1"
                disabled={!!boardState[selectedCardIndex].selectedBy}
                onClick={() => pickSelectedCard()}
              >
                Select <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </>
        )}

        <div className="flex grow flex-row justify-start gap-4">
          {playerDecks.map((playerDeck, i) => (
            <div
              key={i}
              className={`flex flex-col border px-1 ${
                playerTurn === i ? "outline outline-1 outline-blue-500" : ""
              }`}
            >
              <Deck cards={playerDeck} fixed title={`Player ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
