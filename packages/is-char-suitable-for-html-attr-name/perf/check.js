#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const is = require("../");
const testme = () => {
  is("A");
};

// action
runPerf(testme, callerDir);
