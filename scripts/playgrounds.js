#!/usr/bin/env node

import fs from "fs";
import path from "path";
import axios from "axios";
const url = `https://raw.githubusercontent.com/codsen/codsen.com/main/data/webapps.json`;

const data = await axios
  .get(url)
  .then((response) => response.data)
  .catch((err) => {
    console.log(
      `013 playgrounds.js: ${`\u001b[${31}m${`Error in axios fetching webapps.json!`}\u001b[${39}m`} ${err}`
    );
    process.exit(0);
  });
if (typeof data === "object" && data.detergent) {
  fs.writeFileSync(path.resolve("stats/webapps.json"), JSON.stringify(data));
  console.log(`\u001b[${32}m${`webapps.json written OK`}\u001b[${39}m`);
}
