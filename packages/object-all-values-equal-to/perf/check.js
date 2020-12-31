#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { allEq } = require("..");

const testme = () =>
  allEq(
    [
      {
        a: false,
      },
      {
        b: false,
      },
    ],
    false
  );

// action
runPerf(testme, callerDir);
