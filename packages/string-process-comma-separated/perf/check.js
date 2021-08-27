#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { processCommaSep } from "../dist/string-process-comma-separated.esm.js";

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
