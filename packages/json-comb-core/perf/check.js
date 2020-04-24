#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { getKeysetSync } = require("..");

const testme = () =>
  getKeysetSync([
    {
      a: false,
      b: {
        c: {
          d: [{ a: "aaa" }],
        },
      },
    },
    {
      b: {
        c: {
          d: [{ b: "bbb", c: "ccc" }],
        },
      },
    },
    {
      b: {
        c: {
          d: false,
        },
      },
    },
    {
      b: {
        c: false,
      },
    },
  ]);

// action
runPerf(testme, callerDir);
