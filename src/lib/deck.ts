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

  return deck;
}
