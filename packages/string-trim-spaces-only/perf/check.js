#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { trimSpaces } = require("..");

const testme = () => trimSpaces("   \n  a a  \n   ");

// action
runPerf(testme, callerDir);
