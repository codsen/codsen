#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () =>
  f(
    5,
    [
      [2, 4],
      [6, 8],
      [10, 15],
      [20, 30],
      [35, 40],
      [45, 50],
      [55, 60],
    ],
    {
      returnMatchedRangeInsteadOfTrue: true,
    }
  );

// action
runPerf(testme, callerDir);
