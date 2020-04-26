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
      {
        a: "a",
        b: "delete this key",
        c: ["b", "b", { b: "d" }],
      },
      {
        b: ["and this key too", "together with this"],
        d: {
          e: { f: { g: ["b", { b: "and this, no matter how deep-nested" }] } },
        },
      },
    ],
    {
      key: "b",
    }
  );

// action
runPerf(testme, callerDir);
