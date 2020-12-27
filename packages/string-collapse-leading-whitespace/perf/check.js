#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { collWhitespace } = require("..");

const testme = () => collWhitespace("\n \n\n\n", 5);

// action
runPerf(testme, callerDir);
