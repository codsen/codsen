// Gather chunks without requesting diagnostics

import { strict as assert } from "node:assert";

import { processCommaSep } from "../dist/string-process-comma-separated.esm.js";

const chunks = [];

processCommaSep("alpha,beta,gamma", {
  cb: (from, to) => chunks.push([from, to]),
});

assert.deepEqual(chunks, [
  [0, 5],
  [6, 10],
  [11, 16],
]);
