#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { rRegex } = require("..");

const testme = () => rRegex(/def/g, "abcdefghij_abcdefghij", "");

// action
runPerf(testme, callerDir);
