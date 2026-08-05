const fs = require("node:fs");
const path = require("node:path");

const readPart = (filename) =>
  fs.readFileSync(path.join(process.cwd(), "api", "photo-parts", filename), "utf8").trim();

const imageBuffer = Buffer.from(
  [
    readPart("part1.txt"),
    readPart("part2.txt"),
    readPart("part3.txt"),
    readPart("part4.txt"),
    readPart("part5.txt")
  ].join(""),
  "base64"
);

module.exports = function handler(req, res) {
  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Content-Length", String(imageBuffer.length));
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=31536000, immutable");
  res.status(200).send(imageBuffer);
};
