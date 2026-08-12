// Include all adjacent whitespace on the right

import { strict as assert } from "node:assert";

import { expander } from "../dist/string-range-expander.esm.js";

assert.deepEqual(
  expander({
    str: "aaa  bbb  ccc",
    from: 5,
    to: 8,
    wipeAllWhitespaceOnRight: true,
  }),
  [4, 10],
);
