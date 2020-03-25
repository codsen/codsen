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
      [3, 8, "c"],
      [1, 4],
      [2, 5, "b"],
    ],
    { mergeType: 2 }
  );

// action
runPerf(testme, callerDir);
