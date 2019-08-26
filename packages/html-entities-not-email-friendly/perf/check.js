#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const { notEmailFriendly } = require("../");
const testme = () => Object.keys(notEmailFriendly).length;

// action
runPerf(testme, callerDir);
