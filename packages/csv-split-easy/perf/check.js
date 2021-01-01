#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { splitEasy } = require("..");

const testme = () => splitEasy("a,b,c\n\r,,\n\r,,\n,,\n,,\r,,\n,,\n,d,");

// action
runPerf(testme, callerDir);
