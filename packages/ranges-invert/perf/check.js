#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { rInvert } = require("..");

const testme = () =>
  rInvert(
    [
      [0, 1],
      [1, 2],
      [5, 9],
    ],
    9
  );

// action
runPerf(testme, callerDir);
