#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { isRel } = require("..");

const testme = () => isRel("//example.com/path///resource.txt");

// action
runPerf(testme, callerDir);
