#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const f = require("../");
const testme = () =>
  f(
    "skjglk djjflgkhjjlsjh fshdfh klahl\n jsldfj ldkjgl dkfjgldjlhj;gfkjljlsdflhs"
  );

// action
runPerf(testme, callerDir);
