#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { isEmpty } = require("..");

const testme = () =>
  isEmpty([
    {
      a: [""],
      b: { c: ["", " ", { d: [""] }] },
    },
  ]);

// action
runPerf(testme, callerDir);
