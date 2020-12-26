#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { rOffset } = require("..");

const testme = () =>
  rOffset(
    [
      [0, 1],
      [1, 2],
      [5, 9],
    ],
    100
  );

// action
runPerf(testme, callerDir);
