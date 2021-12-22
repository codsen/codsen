// Quick Take

import { strict as assert } from "assert";

import { rApply } from "../dist/ranges-apply.esm.js";

const oldString = `The quick brown fox jumps over the lazy dog.`;
const ranges = [
  [4, 19, "bad grey wolf"],
  [35, 43, "little Red Riding Hood"],
];
assert.equal(
  rApply(oldString, ranges),
  "The bad grey wolf jumps over the little Red Riding Hood."
);
