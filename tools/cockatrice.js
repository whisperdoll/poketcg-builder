import { create } from "xmlbuilder2";
import fs from "fs";
import npath from "path";
import yaml from "yaml";

const rootNode = create({ version: "1.0", encoding: "UTF-8" }).ele(
  "cockatrice_carddatabase",
  {
    version: 4,
    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "xsi:schemaLocation":
      "https://raw.githubusercontent.com/Cockatrice/Cockatrice/master/doc/carddatabase_v4/cards.xsd",
  },
);
rootNode.ele("info");

// formats

const setsNode = rootNode.ele("sets");

const formatData = JSON.parse(fs.readFileSync("sets.json", "utf8"));

for (const [formatId, format] of Object.entries(formatData)) {
  const setNode = setsNode.ele("set");
  setNode.ele("name").txt(format.abbr);
  setNode.ele("longname").txt(format.name);
  setNode.ele("settype").txt("Pokemon");
}

// cards

const cardsNode = rootNode.ele("cards");
const cardData = JSON.parse(fs.readFileSync("cards.json", "utf8"));

for (const [cardId, card] of Object.entries(cardData)) {
  const set = formatData[card.id.split("-")[0]];

  const cardNode = cardsNode.ele("card");
  cardNode.ele("name").txt(`${card.name} ${set.abbr} ${card.number}`);

  const propNode = cardNode.ele("prop");
  propNode.ele("colors");
  card.evolvesFrom && propNode.ele("Evolves_From").txt(card.evolvesFrom);
  card.evolvesTo?.forEach((evolvesTo) => {
    propNode.ele("Evolves_To").txt(evolvesTo);
  });
  propNode.ele("maintype").txt(card.superType);
  card.subTypes && propNode.ele("type").txt(card.subTypes.join(", "));
  propNode.ele("pt").txt(card.hp || "");

  cardNode
    .ele("set", {
      rarity: card.rarity,
      picurl: `https://www.whisperdoll.love/poketcg-builder/cards/large/${card.id}.jpg`,
    })
    .txt(set.abbr);

  const cardText = [
    [card.name, card.hp && `♥${card.hp}`, card.types && card.types.join("")]
      .filter((_) => _)
      .join("\t"),
    [card.superType, ...(card.subTypes || [])].join(", "),
    "",
    (card.abilities || [])
      .map((ability) => `${ability.type}: ${ability.name}\n${ability.text}`)
      .join("\n\n"),
    "",
    (card.moves || [])
      .map(
        (move) =>
          `${move.cost.join("")}\t${move.name}\t${move.damage}${
            move.text && `\n${move.text}`
          }`,
      )
      .join("\n\n"),
    "",
    card.text,
    card.weaknesses &&
      `Weakness: ${card.weaknesses
        .map((w) => `${w.type} ${w.value}`)
        .join(", ")}`,
    card.resistances &&
      `Resistance: ${card.resistances
        .map((w) => `${w.type} ${w.value}`)
        .join(", ")}`,
    card.retreatCost !== undefined && `Retreat cost: ${card.retreatCost}`,
  ]
    .filter((_) => _ !== undefined && _ !== null)
    .join("\n");

  cardNode.ele("text").txt(cardText);
}

// const rootNode = create().ele("squares");
// rootNode.com("f(x) = x^2");
// for (let i = 1; i <= 5; i++) {
//   const item = rootNode.ele("data");
//   item.att("x", i);
//   item.att("y", i * i);
// }

const xml = rootNode.end({ prettyPrint: true });
console.log(xml);
