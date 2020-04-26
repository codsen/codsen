#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () =>
  f([
    [
      {
        a: "a",
      },
      {
        b: "b",
      },
    ],
    {
      c: "c",
      d: [{ e: "e" }],
    },
  ]);

// action
runPerf(testme, callerDir);
