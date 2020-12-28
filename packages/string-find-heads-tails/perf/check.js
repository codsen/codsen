#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { strFindHeadsTails } = require("..");

const testme = () => strFindHeadsTails("abc%%_def_%%ghi", "%%_", "_%%");

// action
runPerf(testme, callerDir);
