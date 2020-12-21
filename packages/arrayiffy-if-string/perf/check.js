#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { arrayiffy } = require("..");

const testme = () => arrayiffy("aaa");

// action
runPerf(testme, callerDir);
