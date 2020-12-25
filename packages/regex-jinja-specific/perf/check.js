#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { isJinjaSpecific } = require("..");

const testme = () => isJinjaSpecific();

// action
runPerf(testme, callerDir);
