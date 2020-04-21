#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { decode } = require("..");

const testme = () => decode("&aleph;");

// action
runPerf(testme, callerDir);
