#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { isOpening } = require("..");

const testme = () => isOpening("zzz<img           /    >zzz");

// action
runPerf(testme, callerDir);
