#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const { isProduction4a } = require("../");
const testme = () => isProduction4a("\uD800\uDC00");

// action
runPerf(testme, callerDir);
