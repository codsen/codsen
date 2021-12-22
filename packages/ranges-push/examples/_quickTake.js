// Quick Take

import { strict as assert } from "assert";

import { Ranges } from "../dist/ranges-push.esm.js";
import { rApply } from "../../ranges-apply/dist/ranges-apply.esm.js";

const gatheredRanges = new Ranges();

const oldString = `The quick brown fox jumps over the lazy dog.`;

// push the ranges
gatheredRanges.push(35, 43, "little Red Riding Hood");
gatheredRanges.push(4, 19, "bad grey wolf");

// retrieve the merged and sorted ranges by calling .current()
assert.deepEqual(gatheredRanges.current(), [
  [4, 19, "bad grey wolf"],
  [35, 43, "little Red Riding Hood"],
]);

assert.equal(
  rApply(oldString, gatheredRanges.current()),
  "The bad grey wolf jumps over the little Red Riding Hood."
);

// wipe all gathered ranges
gatheredRanges.wipe();
assert.equal(gatheredRanges.current(), null);
