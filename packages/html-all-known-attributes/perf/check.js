#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const { allHtmlAttribs } = require("../");
const testme = () => allHtmlAttribs.size;

// action
runPerf(testme, callerDir);
