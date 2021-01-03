#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { flattenAllArrays } = require("..");

const testme = () =>
  flattenAllArrays({
    d: "d",
    b: "b",
    a: "a",
    c: [
      {
        b: "b",
        a: "a",
      },
      {
        d: "d",
        c: "c",
      },
    ],
  });

// action
runPerf(testme, callerDir);
