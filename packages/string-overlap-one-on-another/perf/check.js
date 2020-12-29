#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { overlap } = require("..");

const testme = () =>
  overlap("123", "b", { offset: 5, offsetFillerCharacter: "" });

// action
runPerf(testme, callerDir);
