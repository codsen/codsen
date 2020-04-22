#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () => f([[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]], 1);

// action
runPerf(testme, callerDir);
