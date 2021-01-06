#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { alts } = require("..");

const testme = () => alts("zzz<img           /    >zzz");

// action
runPerf(testme, callerDir);
