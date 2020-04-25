#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const input = {
  a: {
    b: {
      c: "c_val",
      d: "d_val",
      e: "e_val",
    },
    f: {
      g: {
        h: ["1", "2", "3"],
        i: [
          "4",
          "5",
          {
            j: "k",
          },
        ],
        l: ["7", "8", "9"],
      },
    },
  },
};
const testme = () =>
  f(input, (key1, val1) => {
    const current = val1 !== undefined ? val1 : key1;
    return current;
  });

// action
runPerf(testme, callerDir);
