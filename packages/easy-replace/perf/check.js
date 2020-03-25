#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const f = require("../");
const testme = () =>
  f(
    "&nbsp;&nbsp&nbsp",
    {
      leftOutsideNot: "",
      leftOutside: "",
      leftMaybe: "",
      searchFor: "nbsp",
      rightMaybe: "",
      rightOutside: "",
      rightOutsideNot: ";",
    },
    "nbsp;"
  );

// action
runPerf(testme, callerDir);
