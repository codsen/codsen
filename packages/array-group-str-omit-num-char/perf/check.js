#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () => f(["a1-1", "a2-2", "b3-3", "c4-4"]);

// action
runPerf(testme, callerDir);
