#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const f = require("../");
const testme = () =>
  f({
    str: "aaaaaaaaaaaa",
    from: 2,
    to: 5,
    addSingleSpaceToPreventAccidentalConcatenation: true,
  });

// action
runPerf(testme, callerDir);
