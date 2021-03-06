#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { noNewKeys } = require("..");

const testme = () =>
  noNewKeys(
    {
      a: [
        {
          b: "aaa",
          d: "aaa",
          f: "fff",
        },
        {
          c: "aaa",
          k: "kkk",
        },
      ],
      x: "x",
    },
    {
      a: [
        {
          b: "bbb",
          c: "ccc",
        },
      ],
    },
    { mode: 1 }
  );

// action
runPerf(testme, callerDir);
