import cards, { type ICard } from "../resources/cards";
import sets from "../resources/sets";

export type CardId = string;

interface CardSlot {
  cardId: CardId;
  amount: number;
}

export type Deck = CardSlot[];
export type DeckSave = {
  name: string;
  cards: Deck;
  formats: string[] | undefined;
};

export function sortDeck(deck: Deck) {
  return deck.sort((a, b) => a.cardId.localeCompare(b.cardId));
}

function exportCard(cardSlot: CardSlot) {
  const card = cards[cardSlot.cardId];
  const set = sets[card.id.split("-")[0]];
  return `* ${cardSlot.amount} ${card.name} ${set.abbr} ${card.number}`;
}

export function exportDeck(deck: Deck) {
  return sortDeck(deck).map(exportCard).join("\n");
}

export function importDeck(lines: string[]) {
  const deck: Deck = [];

  lines.forEach((line) => {
    const parts = line.trim().split(" ");
    if (parts[0] === "*") {
      parts.splice(0, 1);
    }

    const amount = parseInt(parts[0]);
    let number = parts[parts.length - 1];
    let setAbbr = parts[parts.length - 2];

    if (number.endsWith(")")) {
      number = number.substr(0, number.length - 1);
    }
    if (setAbbr.startsWith("(")) {
      setAbbr = setAbbr.substr(1);
    }
    const set = Object.values(sets).find((s) => s.abbr === setAbbr);
    if (!set) return;

    const card = Object.values(cards).find(
      (c) => c.id.split("-")[0] === set.id && c.number === number,
    );
    if (!card) return;

    deck.push({ amount, cardId: card.id });
  });

  return sortDeck(deck);
}

export function countDeck(deck: Deck) {
  return deck.reduce((acc, card) => acc + card.amount, 0);
}

export function addToDeck(deck: Deck, ...cards: string[] | ICard[]): Deck {
  let ret = deck.slice(0);

  cards.forEach((card) => {
    const cardId = typeof card === "string" ? card : card.id;
    const existing = deck.some((c) => c.cardId === cardId);

    if (existing) {
      ret = ret.map((c) =>
        c.cardId === cardId ? { cardId, amount: c.amount + 1 } : c,
      );
    } else {
      ret = [...ret, { cardId, amount: 1 }];
    }
  });

  return ret;
}

export function deckFromCards(cards: string[] | ICard[]): Deck {
  return addToDeck([], ...cards);
}

export function cardsFromDeck(deck: Deck): CardId[] {
  const ret: CardId[] = [];
  deck.forEach((cs) => {
    cs.amount.times((_) => ret.push(cs.cardId));
  });
  return ret;
}
