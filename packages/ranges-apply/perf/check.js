#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () =>
  f("aaa delete me bbb and me too ccc", [
    [4, 14],
    [18, 29],
  ]);

// action
runPerf(testme, callerDir);
