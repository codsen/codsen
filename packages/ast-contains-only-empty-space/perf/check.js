#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { empty } = require("..");

const testme = () =>
  empty([
    "   ",
    {
      key2: "   ",
      key3: "   \n   ",
      key4: "   \t   ",
    },
    "\n\n\n\n\n\n   \t   ",
  ]);

// action
runPerf(testme, callerDir);
