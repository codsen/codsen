#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");
const { Linter } = require("..");

// 1. basic tests
const str = "< a>";
const linter = new Linter();
linter.setMaxListeners(Infinity);
const testme = () =>
  linter.verify(str, {
    rules: {
      "tag-space-after-opening-bracket": 2,
    },
  });

// action
runPerf(testme, callerDir);
