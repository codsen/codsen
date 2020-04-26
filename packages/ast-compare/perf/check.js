#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () =>
  f(
    [{ a: "a" }, { b: "b" }, { c1: "c1", c2: "c2" }, { d2: "d2" }, { e: "e" }],
    [
      { c2: "c2", c1: "c1" },
      { d2: "d2", d1: "d1" },
    ]
  );

// action
runPerf(testme, callerDir);
