#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { looseCompare } = require("..");

const testme = () =>
  looseCompare(
    {
      a: "a",
      b: {
        c: "c",
      },
    },
    {
      a: "a",
      b: undefined,
    }
  );

// action
runPerf(testme, callerDir);
