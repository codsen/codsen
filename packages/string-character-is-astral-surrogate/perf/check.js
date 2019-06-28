#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const { isHighSurrogate } = require("../");
const testme = () => isHighSurrogate("\uD83E");

// action
runPerf(testme, callerDir);
