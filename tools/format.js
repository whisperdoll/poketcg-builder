import fs from "fs";
import npath from "path";
import yaml from "yaml";

const path = npath.resolve("../resources/formats.yaml");

const formats = yaml.parse(fs.readFileSync(path, "utf8"));

const allFormats = {};
formats.forEach((format) => {
  allFormats[format.enumId] = format;
});

console.log(allFormats);
