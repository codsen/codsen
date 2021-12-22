#!/usr/bin/env node

import fs from "fs";
import path from "path";
import axios from "axios";

const url = `https://raw.githubusercontent.com/codsen/api/main/webapps.json`;

// This script works as a some sort of persistence layer -
// if we can fetch, we write a file. If we fail, nothing
// happens. Other programs will consume the file, either
// coming from previous, successful fetches, or fresh,
// seconds ago. This means, we can run lect offline,
// at penalty of possibly some stale data.
const data = await axios
  .get(url)
  .then((response) => response.data)
  .catch((err) => {
    console.log(
      `020 fetch-webapps-json.js: ${`\u001b[${31}m${`Error in axios fetching webapps.json!`}\u001b[${39}m`} ${err}`
    );
    process.exit(0);
  });
if (typeof data === "object" && data.detergent) {
  fs.writeFileSync(
    path.resolve("./ops/data/webapps.json"),
    JSON.stringify(data)
  );
  console.log(`\u001b[${32}m${`webapps.json written OK`}\u001b[${39}m`);
}
