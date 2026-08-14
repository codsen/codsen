// deps
import { strict as assert } from "node:assert";
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { processCommaSep } from "../dist/string-process-comma-separated.esm.js";

const callerDir = path.resolve(".");

const testme = () => {
  const gatheredChunks = [];
  const gatheredErrors = [];
  processCommaSep('<FRAMESET rows="50%,,  50%">', {
    from: 16,
    to: 26,
    cb: (idxFrom, idxTo) => {
      // console.log(
      //   `012 test/helper(): opts.cb called, idxFrom = ${idxFrom}, idxTo = ${idxTo}`
      // );
      gatheredChunks.push([idxFrom, idxTo]);
    },
    errCb: (ranges, message, fixable) => {
      // console.log(
      //   `018 test/helper(): opts.errCb called, idxFrom = ${idxFrom}, idxTo = ${idxTo}; errName = ${errName}`
      // );
      gatheredErrors.push({ fixable, message, ranges });
    },
  });
  return { gatheredChunks, gatheredErrors };
};

// action
assert.deepEqual(testme(), {
  gatheredChunks: [
    [16, 19],
    [23, 26],
  ],
  gatheredErrors: [
    {
      fixable: true,
      message: "Remove separator.",
      ranges: [[20, 21]],
    },
    {
      fixable: true,
      message: "Remove whitespace.",
      ranges: [[21, 23]],
    },
  ],
});
runPerf(testme, callerDir);
