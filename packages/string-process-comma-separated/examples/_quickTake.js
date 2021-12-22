// Quick Take

import { strict as assert } from "assert";

import { processCommaSep } from "../dist/string-process-comma-separated.esm.js";

const gatheredChunks = [];
const gatheredErrors = [];
const rawnbsp = "\u00a0";

// it's a callback-interface:
processCommaSep(`<FRAMESET rows=" ,,\t50% ,${rawnbsp} 50% ,\t\t,">`, {
  from: 16, // <- beginning of the attribute's value
  to: 35, // <- ending of the attribute's value
  separator: ",",
  cb: (idxFrom, idxTo) => {
    gatheredChunks.push([idxFrom, idxTo]);
  },
  errCb: (ranges, message) => {
    gatheredErrors.push({ ranges, message });
  },
});

assert.deepEqual(gatheredChunks, [
  [20, 23],
  [27, 30],
]);

assert.deepEqual(gatheredErrors, [
  { ranges: [[16, 17]], message: "Remove whitespace." },
  { ranges: [[17, 18]], message: "Remove separator." },
  { ranges: [[18, 19]], message: "Remove separator." },
  { ranges: [[19, 20]], message: "Remove whitespace." },
  { ranges: [[23, 24]], message: "Remove whitespace." },
  { ranges: [[25, 27]], message: "Remove whitespace." },
  { ranges: [[30, 31]], message: "Remove whitespace." },
  { ranges: [[32, 34]], message: "Remove whitespace." },
  { ranges: [[31, 32]], message: "Remove separator." },
  { ranges: [[34, 35]], message: "Remove separator." },
]);
