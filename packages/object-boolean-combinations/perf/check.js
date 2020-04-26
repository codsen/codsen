#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () =>
  f({
    a: 1,
    b: 1,
    c: 1,
    d: 1,
    e: 0,
    f: 1,
    g: 1,
  });

// action
runPerf(testme, callerDir);
