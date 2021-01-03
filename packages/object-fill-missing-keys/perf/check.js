#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { fillMissing } = require("..");

const testme = () =>
  fillMissing(
    {
      a: {
        x: "x",
      },
      z: "z",
    },
    {
      a: {
        b: {
          c: false,
          d: false,
        },
        x: false,
      },
      z: false,
    },
    {
      doNotFillThesePathsIfTheyContainPlaceholders: ["a.b"],
    }
  );

// action
runPerf(testme, callerDir);
