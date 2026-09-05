// Observe preparation and lookup progress
import assert from "node:assert/strict";
import { createMatcher } from "../dist/string-typo-match.esm.js";

const preparation = [];
const matching = [];
const matcher = createMatcher(["screen", "print", "speech"], {
  progressFn: (percentage) => preparation.push(percentage),
});
const result = matcher.match("scren", {
  progressFn: (percentage) => matching.push(percentage),
});
assert.equal(preparation[0], 0);
assert.equal(preparation[preparation.length - 1], 100);
assert.equal(matching[matching.length - 1], 100);
assert.equal(result.bestMatch, "screen");
