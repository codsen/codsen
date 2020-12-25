#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { isJSP } = require("..");

const testme = () => isJSP();

// action
runPerf(testme, callerDir);
