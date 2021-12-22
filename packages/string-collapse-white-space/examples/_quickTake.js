// Quick Take

import { strict as assert } from "assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";

assert.equal(
  collapse("  aaa     bbb    ccc   dddd  ").result,
  "aaa bbb ccc dddd"
);

assert.equal(collapse("   \t\t\t   aaa   \t\t\t   ").result, "aaa");

assert.equal(
  collapse("   aaa   bbb  \n    ccc   ddd   ", { trimLines: false }).result,
  "aaa bbb \n ccc ddd"
);

assert.equal(
  collapse("   aaa   bbb  \n    ccc   ddd   ", { trimLines: true }).result,
  "aaa bbb\nccc ddd"
);

// \xa0 is an unencoded non-breaking space:
assert.equal(
  collapse(
    "     \xa0    aaa   bbb    \xa0    \n     \xa0     ccc   ddd   \xa0   ",
    { trimLines: true, trimnbsp: true }
  ).result,
  "aaa bbb\nccc ddd"
);
