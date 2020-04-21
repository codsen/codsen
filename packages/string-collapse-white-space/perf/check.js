#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () =>
  f(" a \n \n b ", {
    trimLines: false,
    trimnbsp: true,
    removeEmptyLines: false,
  });

// action
runPerf(testme, callerDir);
