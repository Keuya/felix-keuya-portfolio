const fs = require("node:fs");
const path = require("node:path");

const partPaths = [1, 2, 3, 4, 5].map((part) =>
  path.join(process.cwd(), "api", "photo-parts", `part${part}.txt`)
);

const imageBuffer = Buffer.from(
  partPaths.map((filePath) => fs.readFileSync(filePath, "utf8").trim()).join(""),
  "base64"
);

module.exports = function handler(req, res) {
  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Content-Length", String(imageBuffer.length));
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=31536000, immutable");
  res.status(200).send(imageBuffer);
};
