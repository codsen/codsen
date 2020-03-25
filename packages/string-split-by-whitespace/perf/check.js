#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const f = require("../");
const testme = () =>
  f("some interesting {{text}} {% and %} {{ some more }} text.", {
    ignoreRanges: [
      [17, 25],
      [26, 35],
      [36, 51],
    ],
  });

// action
runPerf(testme, callerDir);
