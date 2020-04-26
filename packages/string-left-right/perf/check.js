#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { right } = require("..");

const testme = () =>
  right("a \n\n\n     \n      \t\t\t\t      \n \n    \n b", 1);

// action
runPerf(testme, callerDir);
