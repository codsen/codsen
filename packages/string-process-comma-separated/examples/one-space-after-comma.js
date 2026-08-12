// Allow one space after a comma

import { strict as assert } from "node:assert";

import { processCommaSep } from "../dist/string-process-comma-separated.esm.js";

const errors = [];

processCommaSep("50%,  50%", {
  oneSpaceAfterCommaOK: true,
  errCb: (ranges, message, fixable) =>
    errors.push({ ranges, message, fixable }),
});

// Only the second of the two spaces needs removal.
assert.deepEqual(errors, [
  {
    ranges: [[5, 6]],
    message: "Remove whitespace.",
    fixable: true,
  },
]);
