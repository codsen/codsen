#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () => f([[5], [1, 2, 3], [1, 2]]);

// action
runPerf(testme, callerDir);
