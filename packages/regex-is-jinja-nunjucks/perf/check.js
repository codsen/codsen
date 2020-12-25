#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { isJinjaNunjucksRegex } = require("..");

const testme = () => isJinjaNunjucksRegex();

// action
runPerf(testme, callerDir);
