#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const { set } = require("../");
const testme = () => set(`{ "a": "b", "c": { "d": ["e"] } }`, "c.d", 1);

// action
runPerf(testme, callerDir);
