#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { unicodeToNative } = require("..");

const testme = () => unicodeToNative("\uD834\uDF06aa", [1, 0, 2]);

// action
runPerf(testme, callerDir);
