#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { er } = require("..");

const testme = () =>
  er(
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
