#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const is = require("../");
const testme = () => {
  is(`<a href="zzz" target="_blank" style="color: black;">`, 21, 28);
};

// action
runPerf(testme, callerDir);
