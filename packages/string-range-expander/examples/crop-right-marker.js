// Include a configured right-side marker in the range

import { strict as assert } from "node:assert";

import { expander } from "../dist/string-range-expander.esm.js";

assert.deepEqual(
  expander({
    str: "  ;  aaa  ;  ",
    from: 5,
    to: 8,
    ifRightSideIncludesThisCropItToo: ";",
  }),
  [4, 12],
);
