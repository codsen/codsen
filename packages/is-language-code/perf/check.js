#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { isLangCode } = require("..");

const testme = () => isLangCode("zzz<img           /    >zzz");

// action
runPerf(testme, callerDir);
