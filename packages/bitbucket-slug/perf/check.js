#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { bSlug } = require("..");

const testme = () =>
  bSlug("# Let's backwards-engineer BitBucket anchor link slug algorithm");

// action
runPerf(testme, callerDir);
