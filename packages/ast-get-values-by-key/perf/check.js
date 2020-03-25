#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const f = require("../");
const testme = () =>
  f(
    {
      tag: {
        a: "b",
      },
    },
    "tag",
    [
      {
        c: "d",
      },
    ]
  );

// action
runPerf(testme, callerDir);
