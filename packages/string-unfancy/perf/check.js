#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { unfancy } = require("..");

const testme = () => unfancy("zzz&amp;amp;rsquo;zzz\n“zzz”");

// action
runPerf(testme, callerDir);
