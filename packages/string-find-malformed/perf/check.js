#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { findMalformed } = require("..");

const gathered = [];
const testme = () =>
  findMalformed(
    "abcabcd.f",
    "abcdef",
    (obj) => {
      gathered.push(obj);
    },
    {
      maxDistance: 2,
    }
  );

// action
runPerf(testme, callerDir);
