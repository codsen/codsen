#!/usr/bin/env node

// deps
const path = require("path");
const fs = require("fs");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { comb } = require("..");

const source = fs.readFileSync(path.resolve("./perf/dummy_file.html"), "utf8");
const testme = () =>
  comb(source, {
    uglify: true,
  });

// action
runPerf(testme, callerDir);
