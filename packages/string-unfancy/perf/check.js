#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const f = require("../");
const testme = () => f("zzz&amp;amp;rsquo;zzz\n“zzz”");

// action
runPerf(testme, callerDir);
