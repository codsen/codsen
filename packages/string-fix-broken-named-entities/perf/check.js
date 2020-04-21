#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () => f("&&NbSpzzz&&NbSpzzz\ny &isindot; z\n&nsp;\n&pound");

// action
runPerf(testme, callerDir);
