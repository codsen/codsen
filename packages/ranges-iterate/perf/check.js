#!/usr/bin/env node
/*eslint no-unused-vars:0*/

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const f = require("../");
let pinged = "";
let index = 0;
const testme = () =>
  f(
    "abcdefghij",
    [
      [0, 5],
      [5, 10],
    ],
    ({ i, val }) => {
      pinged += val;
      index++;
    }
  );

// action
runPerf(testme, callerDir);
