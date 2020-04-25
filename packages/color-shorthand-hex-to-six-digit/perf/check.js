#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () => f("aaaa #f0c zzzz\n\t\t\t#fc0");

// action
runPerf(testme, callerDir);
