#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { groupStr } = require("..");

const testme = () => groupStr(["a1-1", "a2-2", "b3-3", "c4-4"]);

// action
runPerf(testme, callerDir);
