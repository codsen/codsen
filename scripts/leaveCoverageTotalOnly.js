#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const covPath = path.resolve("./coverage/coverage-summary.json");
const { total } = JSON.parse(fs.readFileSync(covPath));

// leaves only "total" key contents - local and CI file paths differ and file
// breakdown objects containing per-path entries pollute git records
fs.writeFileSync(covPath, JSON.stringify({ total }));
