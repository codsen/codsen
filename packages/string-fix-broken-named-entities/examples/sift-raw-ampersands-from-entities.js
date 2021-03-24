// Sift raw ampersands in a string from broken character references
// encode those raw ampersands and fix broken character references

import { strict as assert } from "assert";
import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";
import { rApply } from "../../ranges-apply";

const source = "&&nsp;&&nsp;&";

const finalRanges = [];
const indexesOfRawAmpersands = [];

// fixEnt() returns Ranges (see codsen.com/ranges/)
const resultRanges = fixEnt(source, {
  textAmpersandCatcherCb: (idx) => indexesOfRawAmpersands.push(idx),
});

// check the ranges - all broken NBSP's were fixed:
assert.deepEqual(resultRanges, [
  [1, 6, "&nbsp;"],
  [7, 12, "&nbsp;"],
]);

// don't apply the ranges yet, dump them into the "finalRanges" array
// it's because applying them onto a string,
// rApply(source, resultRanges);
// will mess up the index positions, we'll need to calculate again.
// The whole point of Ranges is they're COMPOSABLE.

resultRanges.forEach((range) => {
  finalRanges.push(range);
});

// check the positions of reported raw ampersands:
assert.deepEqual(indexesOfRawAmpersands, [0, 6, 12]);

// replace each character at these positions: 0, 6 and 12
// with string "&amp;" - in terms of Ranges, it's a matter
// of building a Ranges array:
const replacementRanges = indexesOfRawAmpersands.map((idx) => [
  idx,
  idx + 1,
  "&amp;",
]);
// this is Ranges notation, array of arrays: [from index, to index, what-to-replace]
assert.deepEqual(replacementRanges, [
  [0, 1, "&amp;"], // we're saying, replace indexes from 0 to 1 with &amp;
  [6, 7, "&amp;"],
  [12, 13, "&amp;"],
]);

// push them into resultRanges as well:
replacementRanges.forEach((range) => {
  resultRanges.push(range);
});

// check what's been gathered so far:
assert.deepEqual(resultRanges, [
  [1, 6, "&nbsp;"],
  [7, 12, "&nbsp;"],
  [0, 1, "&amp;"],
  [6, 7, "&amp;"],
  [12, 13, "&amp;"],
]);

// apply Ranges onto a string - all amendments at once!
const finalResultStr = rApply(source, resultRanges);

// check result
assert.equal(finalResultStr, "&amp;&nbsp;&amp;&nbsp;&amp;");

// Voilà! We fixed broken entities and encoded raw ampersands
