// Quick Take

import { strict as assert } from "node:assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";

assert.equal(
  collapse("  aaa     bbb    ccc   dddd  ").result,
  "aaa bbb ccc dddd",
);
