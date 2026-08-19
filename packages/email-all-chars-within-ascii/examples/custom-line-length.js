// Set a custom maximum line length

import { strict as assert } from "node:assert";

import { within } from "../dist/email-all-chars-within-ascii.esm.js";

assert.deepEqual(within("abcde", { lineLength: 3 }), [
  {
    type: "line length",
    line: 1,
    column: 5,
    positionIdx: 5,
    value: 5,
  },
]);
