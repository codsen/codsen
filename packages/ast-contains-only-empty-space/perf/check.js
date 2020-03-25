#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const f = require("../");
const testme = () =>
  f([
    "   ",
    {
      key2: "   ",
      key3: "   \n   ",
      key4: "   \t   ",
    },
    "\n\n\n\n\n\n   \t   ",
  ]);

// action
runPerf(testme, callerDir);
