#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { nonEmpty } = require("..");

const testme = () => nonEmpty([[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]);

// action
runPerf(testme, callerDir);
