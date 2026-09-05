// Configure long omissions explicitly
import assert from "node:assert/strict";
import { matchTypos } from "../dist/string-typo-match.esm.js";

const candidates = ["CounterClockwiseContourIntegral"];
assert.equal(
  matchTypos("CounterContourIntegral", candidates).status,
  "no-match",
);
const result = matchTypos("CounterContourIntegral", candidates, {
  maxOmissionLength: 9,
  maxCost: 300,
});
assert.equal(result.bestMatch, candidates[0]);
