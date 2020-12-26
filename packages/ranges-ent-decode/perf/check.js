#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { rEntDecode } = require("..");

const testme = () => rEntDecode("foo&#x1D306qux");

// action
runPerf(testme, callerDir);
