// Sift raw ampersands in a string from broken character references
// encode those raw ampersands and fix broken character references

import { strict as assert } from "node:assert";
import { rApply } from "ranges-apply";

import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

const source = "&&nsp;&&nsp;&";

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

// check the positions of reported raw ampersands:
assert.equal(indexesOfRawAmpersands.join(","), "0,6,12");

// replace each character at these positions: 0, 6 and 12
// with string "&amp;" - in terms of Ranges, it's a matter
// of building a Ranges array:
const replacementRanges = indexesOfRawAmpersands.map((idx) => [
  idx,
  idx + 1,
  "&amp;",
]);
// push them into resultRanges as well:
replacementRanges.forEach((range) => {
  resultRanges.push(range);
});

// apply Ranges onto a string - all amendments at once!
const finalResultStr = rApply(source, resultRanges);

// check result
assert.equal(finalResultStr, "&amp;&nbsp;&amp;&nbsp;&amp;");

// Voilà! We fixed broken entities and encoded raw ampersands
