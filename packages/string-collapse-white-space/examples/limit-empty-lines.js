// Keep at most one consecutive empty line

import { strict as assert } from "node:assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";

assert.equal(
  collapse("first\n\n\n\nsecond", {
    removeEmptyLines: true,
    limitConsecutiveEmptyLinesTo: 1,
  }).result,
  "first\n\nsecond",
);
