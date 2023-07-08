// Clashing replacement values

import { strict as assert } from "assert";

import { rRegex } from "../dist/ranges-regex.esm.js";
import { rApply } from "../../ranges-apply/dist/ranges-apply.esm.js";
import { Ranges } from "../../ranges-push/dist/ranges-push.esm.js";

// Two tasks:
// 1. replace numbers with asterisks (*)
// 2. but delete all zero chunks

// tasks clash

const source = "sequence: 1234 5678 0000 1234";
const gatheredRanges = new Ranges();
// now can push() new ranges into "gatheredRanges"

// 1.

// conceal number chunks:
const fix1 = rRegex(/\d/g, source, "*");
// \d matches digit
assert.deepEqual(fix1, [
  [10, 14, "****"],

  [15, 19, "****"],

  [20, 24, "****"],

  [25, 29, "****"],
]);
// replacement is correct:
assert.equal(rApply(source, fix1), "sequence: **** **** **** ****");
// push it in:
gatheredRanges.push(fix1);

// 2.

// delete zero chunks:
const fix2 = rRegex(/\b[0]+\b/g, source);
assert.deepEqual(fix2, [[20, 24]]);
// deletion is correct:
assert.equal(rApply(source, fix2), "sequence: 1234 5678  1234");
// push it in:
gatheredRanges.push(fix2);

// 3. - MERGE and APPLY

// what have we got in "gatheredRanges"?
assert.deepEqual(gatheredRanges.current(), [
  [10, 14, "****"],
  [15, 19, "****"],
  [20, 24, "****"],
  [25, 29, "****"],
]);
// notice [[19, 23, "brown"]] is absent - "ranges-merge" program detected
// we're deleting an encompassing range of indexes [12, 29] which
// encompasses to-be-inserted values range at [19, 23] and discarded the
// latter.

// apply both fixes in one go:
assert.equal(
  rApply(source, gatheredRanges.current()),
  "sequence: **** **** **** ****",
);

// hey, the zero chunk deletion range [20, 24] was merged with
// replacement range [20, 24, "****"] and former got lost!

// How do we make that the deletion would make precedence over everything
// else?

// Answer is, put `null` in replacement. It will be interpreted as explicit
// deletion.

// insert null as replacement:
const fix3 = rRegex(/\b[0]+\b/g, source, null);
assert.deepEqual(fix3, [[20, 24, null]]);
// deletion is correct:
assert.equal(rApply(source, fix3), "sequence: 1234 5678  1234");

// wipe the "gatheredRanges"
gatheredRanges.wipe();

// push again
gatheredRanges.push(fix1); // asterisks
gatheredRanges.push(fix3); // zero chunk

// apply again:
assert.equal(
  rApply(source, gatheredRanges.current()),
  "sequence: **** ****  ****",
);
// null in [20, 24, null] overrode the insertion instruction [20, 24, "****"]
