#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { remSep } = require("..");

const testme = () => remSep("1,000,000,000,000,999,999.2");

// action
runPerf(testme, callerDir);
