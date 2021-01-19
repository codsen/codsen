// Quick Take

import { strict as assert } from "assert";
import { within } from "../dist/email-all-chars-within-ascii.esm.js";

// enforces all characters to be within ASCII:
assert.deepEqual(within(`<div>Motörhead</div>`), [
  {
    type: "character",
    line: 1,
    column: 9,
    positionIdx: 8,
    value: "ö",
    codePoint: 246,
    UTF32Hex: "00f6",
  },
]);

// enforces line lengths (500 is best for email):
assert.deepEqual(within(`abcde`, { lineLength: 3 }), [
  {
    type: "line length",
    line: 1,
    column: 5,
    positionIdx: 5,
    value: 5,
  },
]);
