#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { nativeToUnicode } = require("..");

const testme = () => nativeToUnicode("a", 1);

// action
runPerf(testme, callerDir);
