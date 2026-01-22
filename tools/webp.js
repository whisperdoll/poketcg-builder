// @echo off
// for %%f in (*.png) do cwebp -q 70 %%~nf.png -o %%~nf.webp
// del *.png
// for %%f in (*.jpg) do cwebp -q 70 %%~nf.jpg -o %%~nf.webp
// del *.jpg
// for %%f in (*.jpeg) do cwebp -q 70 %%~nf.jpeg -o %%~nf.webp
// del *.jpeg

import fs from "fs";
import npath from "path";
import { exec } from "child_process";

const files = fs.readdirSync(npath.resolve("../public/cards/large"), {
  withFileTypes: true,
});

let index = 0;

function nextFile() {
  index++;

  if (index === files.length) return;
  const file = files[index];

  if (file.isDirectory()) {
    setTimeout(nextFile);
    return;
  }

  if (!file.name.endsWith(".jpg")) {
    setTimeout(nextFile);
    return;
  }

  const src = npath.join(file.parentPath, file.name);
  const dest = npath.join(
    npath.resolve("../public/cards/webp"),
    file.name.substr(0, file.name.length - 4) + ".webp",
  );

  if (fs.existsSync(dest)) {
    setTimeout(nextFile);
    return;
  }

  exec(`cwebp -quiet -q 70 ${src} -o ${dest}`, (err, stdout, stderr) => {
    console.log("");
    console.log(stdout);
    console.log(stderr);
    if (err) {
      console.error(err);
    } else {
      console.log(`converted ${src} -> ${dest}`);
    }
    setTimeout(nextFile);
  });
}

nextFile();
