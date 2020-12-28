#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { collapse } = require("..");

const testme = () =>
  collapse(" a \n \n b ", {
    trimLines: false,
    trimnbsp: true,
    removeEmptyLines: false,
  });

// action
runPerf(testme, callerDir);
