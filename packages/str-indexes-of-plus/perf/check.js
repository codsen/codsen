#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { strIndexesOfPlus } = require("..");

const testme = () => strIndexesOfPlus("zabczabc", "abc", 1);

// action
runPerf(testme, callerDir);
