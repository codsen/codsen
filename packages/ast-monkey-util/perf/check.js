#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const { pathNext } = require("../");
const testme = () => pathNext("9.children.3");

// action
runPerf(testme, callerDir);
