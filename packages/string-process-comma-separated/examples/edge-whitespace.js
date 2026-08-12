// Allow leading and trailing whitespace

import { strict as assert } from "node:assert";

import { processCommaSep } from "../dist/string-process-comma-separated.esm.js";

const chunks = [];
const errors = [];

processCommaSep(" .jpg ", {
  leadingWhitespaceOK: true,
  trailingWhitespaceOK: true,
  cb: (from, to) => chunks.push([from, to]),
  errCb: (ranges, message) => errors.push({ ranges, message }),
});

assert.deepEqual(chunks, [[1, 5]]);
assert.equal(errors.length, 0);
