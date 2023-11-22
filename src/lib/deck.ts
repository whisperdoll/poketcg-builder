import cards, { ICard } from "../resources/cards";
import sets from "../resources/sets";

interface CardSlot {
  cardId: string;
  amount: number;
}

export type Deck = CardSlot[];

function exportCard(cardSlot: CardSlot) {
  const card = cards[cardSlot.cardId];
  const set = sets[card.id.split("-")[0]];
  return `* ${cardSlot.amount} ${card.name} ${set.abbr} ${card.number}`;
}

export function exportDeck(deck: Deck) {
  return deck.map(exportCard).join("\n");
}

export function importDeck(lines: string[]) {
  const deck: Deck = [];

  lines.forEach((line) => {
    const parts = line.split(" ");
    const amount = parseInt(parts[1]);
    const number = parts[parts.length - 1];
    const setAbbr = parts[parts.length - 2];

    const set = Object.values(sets).find((s) => s.abbr === setAbbr);
    if (!set) return deck;

    const card = Object.values(cards).find(
      (c) => c.id.split("-")[0] === set.id && c.number === number,
    );
    if (!card) return deck;

    deck.push({ amount, cardId: card.id });
  });

  return deck;
}
