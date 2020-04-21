#!/usr/bin/env node

// deps
const path = require("path");
const fs = require("fs");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

const dummyHTML = fs.readFileSync(
  path.resolve("./perf/dummy_file.html"),
  "utf8"
);

// setup
const { crush } = require("..");

const testme = () =>
  crush(dummyHTML, {
    removeLineBreaks: true,
  });

// action
runPerf(testme, callerDir);
