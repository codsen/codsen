#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { splitByW } = require("..");

const testme = () =>
  splitByW("some interesting {{text}} {% and %} {{ some more }} text.", {
    ignoreRanges: [
      [17, 25],
      [26, 35],
      [36, 51],
    ],
  });

// action
runPerf(testme, callerDir);
