// Configure whitespace inside a chunk

import { strict as assert } from "node:assert";

import { processCommaSep } from "../dist/string-process-comma-separated.esm.js";

function collect(innerWhitespaceAllowed) {
  const errors = [];
  processCommaSep("abc,def ghi,jkl", {
    innerWhitespaceAllowed,
    errCb: (ranges, message, fixable) =>
      errors.push({ ranges, message, fixable }),
  });
  return errors;
}

assert.deepEqual(collect(false), [
  {
    ranges: [[7, 8]],
    message: "Bad whitespace.",
    fixable: false,
  },
]);
assert.equal(collect(true).length, 0);
