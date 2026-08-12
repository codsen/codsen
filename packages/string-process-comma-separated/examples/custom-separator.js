// Use a custom separator

import { strict as assert } from "node:assert";

import { processCommaSep } from "../dist/string-process-comma-separated.esm.js";

const chunks = [];
const errors = [];

processCommaSep(".50%.50%.", {
  separator: ".",
  cb: (from, to) => chunks.push([from, to]),
  errCb: (ranges, message, fixable) =>
    errors.push({ ranges, message, fixable }),
});

assert.deepEqual(chunks, [
  [1, 4],
  [5, 8],
]);
assert.equal(errors.length, 2);
assert.equal(errors[0].message, "Remove separator.");
