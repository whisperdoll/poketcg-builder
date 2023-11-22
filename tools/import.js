import fs from "fs";
import npath from "path";
import yaml from "yaml";

const path = npath.resolve("../resources/cards");

const cardFileNames = fs.readdirSync(path);

const allCards = {};
const allSets = {};

cardFileNames.forEach((cardFileName) => {
  if (!cardFileName.endsWith(".yaml")) {
    return;
  }

  console.log("Processing " + cardFileName);

  const cardFileContent = fs.readFileSync(
    npath.join(path, cardFileName),
    "utf8",
  );
  const set = yaml.parse(cardFileContent);

  const { cards, ...rest } = set;
  allSets[set.id] = { cards: [], ...rest };
  cards.forEach((card) => {
    allCards[card.id] = card;
    allSets[set.id].cards.push(card.id);
  });
});

console.log("Writing sets.json");
fs.writeFileSync("sets.json", JSON.stringify(allSets), "utf8");
console.log("Writing cards.json");
fs.writeFileSync("cards.json", JSON.stringify(allCards), "utf8");
