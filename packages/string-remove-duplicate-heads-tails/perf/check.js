#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () =>
  f("{{ Hi {{ first_name }}! }}", {
    heads: "   {{     ",
    tails: "    }}       ",
  });

// action
runPerf(testme, callerDir);
