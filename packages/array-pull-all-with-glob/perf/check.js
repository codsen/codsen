#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const f = require("../");
const testme = () =>
  f(
    [
      "Module-1",
      "only this left",
      "module-2",
      "module-3",
      "elements",
      "elemental",
    ],
    ["module-*", "something else", "element*"]
  );

// action
runPerf(testme, callerDir);
