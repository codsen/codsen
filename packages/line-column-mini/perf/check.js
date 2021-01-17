#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { lineCol } = require("..");

const testme = () =>
  lineCol("zzz&amp;amp;rsquo;zzz\n“zzz”".repeat(20), 200, true);

// action
runPerf(testme, callerDir);
