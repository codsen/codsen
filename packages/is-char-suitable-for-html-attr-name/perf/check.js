#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { isAttrNameChar } = require("..");

const testme = () => {
  isAttrNameChar("A");
};

// action
runPerf(testme, callerDir);
