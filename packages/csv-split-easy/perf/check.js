#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () => f("a,b,c\n\r,,\n\r,,\n,,\n,,\r,,\n,,\n,d,");

// action
runPerf(testme, callerDir);
