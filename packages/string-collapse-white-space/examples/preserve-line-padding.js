// Preserve one space around each line's content

import { strict as assert } from "node:assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";

assert.equal(
  collapse("   aaa   bbb  \n    ccc   ddd   ", { trimLines: false }).result,
  "aaa bbb \n ccc ddd",
);
