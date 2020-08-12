#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const covPath = path.resolve("./coverage/coverage-summary.json");
const coverageSummary = JSON.parse(fs.readFileSync(covPath));

// leaves only "total" key contents - local and CI file paths differ and file
// breakdown objects containing per-path entries pollute git records
fs.writeFile(covPath, JSON.stringify(coverageSummary.total), (err) => {
  if (err) {
    throw err;
  }
  console.log(`\u001b[${32}m${`coverage total OK`}\u001b[${39}m`);
});
