#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const { convertAll } = require("../");
const testme = () =>
  convertAll(
    `Welcome to Website Name! Company Name, Inc. ('Company Name' or 'Company') recommends that you read the following terms and conditions carefully.`,
    {
      convertApostrophes: 1,
      convertEntities: 0,
    }
  );

// action
runPerf(testme, callerDir);
