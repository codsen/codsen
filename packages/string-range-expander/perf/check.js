#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { expander } = require("..");

const testme = () =>
  expander({
    str: "aaaaaaaaaaaa",
    from: 2,
    to: 5,
    addSingleSpaceToPreventAccidentalConcatenation: true,
  });

// action
runPerf(testme, callerDir);
