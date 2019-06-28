#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const f = require("../");
const testme = () => f("abc%%_def_%%ghi", "%%_", "_%%");

// action
runPerf(testme, callerDir);
