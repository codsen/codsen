#!/usr/bin/env node
/* eslint no-unused-vars:0 */

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { rIterate } = require("..");

let pinged = "";
let index = 0;
const testme = () =>
  rIterate(
    "abcdefghij",
    [
      [0, 5],
      [5, 10],
    ],
    ({ i, val }) => {
      pinged += val;
      index += 1;
    }
  );

// action
runPerf(testme, callerDir);
