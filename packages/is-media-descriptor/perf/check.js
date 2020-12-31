#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { isMediaD } = require("..");

const testme = () => isMediaD("screen and (color), projection and ((color)");

// action
runPerf(testme, callerDir);
