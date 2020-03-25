#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const f = require("../");
const gather = [];
const testme = () =>
  f("abcdefghij", [[1, 5]], (idx) => {
    gather.push(idx);
  });

// action
runPerf(testme, callerDir);
