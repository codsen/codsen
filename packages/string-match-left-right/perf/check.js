#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { matchRightIncl } = require("..");

const testme = () => matchRightIncl("abcdef", 2, ["gjd", "cy", "cdz", "cde"]);

// action
runPerf(testme, callerDir);
