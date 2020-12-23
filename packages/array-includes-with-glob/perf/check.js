#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { includesWithGlob } = require("..");

const testme = () =>
  includesWithGlob(
    ["something", "anything", "everything"],
    ["anything", "zzz"],
    {
      arrayVsArrayAllMustBeFound: "any",
    }
  );

// action
runPerf(testme, callerDir);
