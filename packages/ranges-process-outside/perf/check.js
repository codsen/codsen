#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { rProcessOutside } = require("..");

const gather = [];
const testme = () =>
  rProcessOutside("abcdefghij", [[1, 5]], (idx) => {
    gather.push(idx);
  });

// action
runPerf(testme, callerDir);
