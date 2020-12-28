#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { extract } = require("..");

const testme = () =>
  extract("p#id-name:lang(it) p#id-name-other:lang(en)", true);

// action
runPerf(testme, callerDir);
