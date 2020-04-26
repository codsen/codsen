#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { helga } = require("..");

const testme = () => helga("abc\ndef", { targetJSON: true });

// action
runPerf(testme, callerDir);
