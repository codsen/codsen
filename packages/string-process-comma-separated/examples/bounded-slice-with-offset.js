// Process a bounded slice and offset reported indexes

import { strict as assert } from "node:assert";

import { processCommaSep } from "../dist/string-process-comma-separated.esm.js";

const chunks = [];

processCommaSep("xxa,bzz", {
  from: 2,
  to: 5,
  offset: 10,
  cb: (from, to) => chunks.push([from, to]),
});

assert.deepEqual(chunks, [
  [12, 13],
  [14, 15],
]);
