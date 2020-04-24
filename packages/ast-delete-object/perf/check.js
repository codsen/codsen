#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () =>
  f(
    [
      "elem1",
      {
        key2: "val2",
        key3: "val3",
        key4: "val4",
      },
      "elem4",
    ],
    {
      key2: "val2",
      key3: "val3",
    },
    { matchKeysStrictly: true, hungryForWhitespace: false }
  );

// action
runPerf(testme, callerDir);
