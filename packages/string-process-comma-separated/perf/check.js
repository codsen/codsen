#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { processCommaSep } = require("..");

const testme = () => {
  const gatheredChunks = [];
  const gatheredErrors = [];
  processCommaSep(`<FRAMESET rows="50%,,  50%">`, {
    from: 16,
    to: 26,
    cb: (idxFrom, idxTo) => {
      // console.log(
      //   `012 test/helper(): opts.cb called, idxFrom = ${idxFrom}, idxTo = ${idxTo}`
      // );
      gatheredChunks.push([idxFrom, idxTo]);
    },
    errCb: (ranges, message) => {
      // console.log(
      //   `018 test/helper(): opts.errCb called, idxFrom = ${idxFrom}, idxTo = ${idxTo}; errName = ${errName}`
      // );
      gatheredErrors.push({ ranges, message });
    },
  });
};

// action
runPerf(testme, callerDir);
