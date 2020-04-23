#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { det } = require("..");

const testme = () =>
  det(
    `<a style="display: block !important;">first\u0003second</a>z\n  \n\n   and more text here \xA3\xA3\xA3\xA3`
  ).res;

// action
runPerf(testme, callerDir);
