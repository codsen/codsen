#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { isAttrClosing } = require("..");

const testme = () => {
  isAttrClosing(`<a href="zzz" target="_blank" style="color: black;">`, 21, 28);
};

// action
runPerf(testme, callerDir);
