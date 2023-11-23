import fs from "fs";
import npath from "path";
import https from "https";

const cards = JSON.parse(fs.readFileSync("cards.json", "utf8"));
const sets = JSON.parse(fs.readFileSync("sets.json", "utf8"));

const cardsToDownload = Object.values(cards);
let counter = 0;
let total = cardsToDownload.length;

async function pop() {
  const card = cardsToDownload.pop();
  if (!card) return;

  const setId = card.id.split("-")[0];
  const set = sets[setId];

  const src = `https://tcgone.net/scans/l/${set.enumId.toLowerCase()}/${
    card.number
  }.jpg`;
  const outputFilePath = npath.resolve(`../public/cards/large/${card.id}.jpg`);
  counter++;

  if (fs.existsSync(outputFilePath)) {
    setTimeout(pop, 1);
    return;
  }

  try {
    await downloadImage(src, outputFilePath);
  } catch (e) {
    if (e) console.log(e);
  }

  setTimeout(pop, 1);
}

pop();
pop();

// Function to download the image
function downloadImage(url, destination) {
  const file = fs.createWriteStream(destination);
  const progressPercent = Math.round((counter / total) * 1000) / 10;
  console.log(`${progressPercent}% (${counter} / ${total})`);
  console.log(`... \tDownloading ${url}\t-> ${destination}`);

  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        // Check if the response status is OK (status code 200)
        if (response.statusCode !== 200) {
          console.log(`x   \tFailed download ${url}\t-> ${destination}`);
          reject();
          return;
        }

        // Pipe the image data to a file stream
        response.pipe(file);

        file.on("finish", () => {
          file.close(() => {
            console.log(`!   \tDownloaded ${url}\t-> ${destination}`);
            resolve();
          });
        });

        file.on("error", (err) => {
          fs.unlink(destination, () => reject(err));
        });
      })
      .on("error", (err) => {
        fs.unlink(destination, () => reject(err));
      });
  });
}
