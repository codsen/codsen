#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const { allHtmlAttribs } = require("../");
const testme = () => Object.keys(allHtmlAttribs).length;

// action
runPerf(testme, callerDir);
