// Include configured left-side marker characters in the range

import { strict as assert } from "node:assert";

import { expander } from "../dist/string-range-expander.esm.js";

assert.deepEqual(
  expander({
    str: "something>\n\t    zzzz <here",
    from: 16,
    to: 20,
    ifLeftSideIncludesThisCropItToo: "\n\t",
  }),
  [10, 20],
);
