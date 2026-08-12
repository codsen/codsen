// Trim multiline content whose boundaries contain non-breaking spaces

import { strict as assert } from "node:assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";

assert.equal(
  collapse(
    "     \xa0    aaa   bbb    \xa0    \n     \xa0     ccc   ddd   \xa0   ",
    { trimLines: true, trimnbsp: true },
  ).result,
  "aaa bbb\nccc ddd",
);
