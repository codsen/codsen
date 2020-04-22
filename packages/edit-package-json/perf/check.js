#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { set } = require("..");

const testme = () => set(`{ "a": "b", "c": { "d": ["e"] } }`, "c.d", 1);

// action
runPerf(testme, callerDir);
