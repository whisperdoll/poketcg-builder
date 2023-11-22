import fs from "fs";

const cards = JSON.parse(fs.readFileSync("cards.json", "utf8"));

const toCheck = ["superType", "subTypes", "retreatCost", "artist"];

const sets = {};

toCheck.forEach((key) => (sets[key] = new Set()));

Object.entries(cards).forEach(([id, card]) => {
  toCheck.forEach((key) => {
    const item = card[key];
    if (Array.isArray(item)) {
      item.forEach((i) => sets[key].add(i));
    } else {
      sets[key].add(item);
    }
  });
});

for (const key in sets) {
  sets[key] = Array.from(sets[key]);
}

fs.writeFileSync("filters.json", JSON.stringify(sets), "utf8");
