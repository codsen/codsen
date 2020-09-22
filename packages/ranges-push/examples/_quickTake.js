/* eslint import/extensions:0, no-unused-vars:0 */

// Quick Take

import { strict as assert } from "assert";
import Ranges from "../dist/ranges-push.esm.js";
import applyR from "../../ranges-apply";

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
  applyR(oldString, gatheredRanges.current()),
  "The bad grey wolf jumps over the little Red Riding Hood."
);

// wipe all gathered ranges
gatheredRanges.wipe();
assert.equal(gatheredRanges.current(), null);
