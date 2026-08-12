// Quick Take

import { strict as assert } from "node:assert";

import { processCommaSep } from "../dist/string-process-comma-separated.esm.js";

const gatheredChunks = [];

// it's a callback-interface:
processCommaSep("alpha,beta", {
  cb: (idxFrom, idxTo) => {
    gatheredChunks.push([idxFrom, idxTo]);
  },
});

assert.deepEqual(gatheredChunks, [
  [0, 5],
  [6, 10],
]);
