#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () =>
  f(
    [
      [1, 3],
      [5, 10],
      [12, 15],
      [16, 20],
    ],
    15
  );

// action
runPerf(testme, callerDir);
