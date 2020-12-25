#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { getByKey } = require("..");

const testme = () =>
  getByKey(
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
