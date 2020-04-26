#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () =>
  f("# Let's backwards-engineer BitBucket anchor link slug algorithm");

// action
runPerf(testme, callerDir);
