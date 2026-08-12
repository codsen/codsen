// Expand whitespace only on the right side

import { strict as assert } from "node:assert";

import { expander } from "../dist/string-range-expander.esm.js";

assert.deepEqual(
  expander({
    str: "a>     <b",
    from: 4,
    to: 5,
    extendToOneSide: "right",
  }),
  [4, 6],
);
