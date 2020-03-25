#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const { find } = require("../");

// find()
const testme = () =>
  find(
    {
      a: {
        b: "c1",
      },
      k: {
        b: "c2",
      },
      z: {
        x: "y",
      },
    },
    {
      key: null,
      val: { b: "c*" },
    }
  );

// action
runPerf(testme, callerDir);
