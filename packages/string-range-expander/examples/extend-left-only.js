// Expand whitespace only on the left side

import { strict as assert } from "node:assert";

import { expander } from "../dist/string-range-expander.esm.js";

assert.deepEqual(
  expander({
    str: "a>     <b",
    from: 4,
    to: 5,
    extendToOneSide: "left",
  }),
  [3, 5],
);
