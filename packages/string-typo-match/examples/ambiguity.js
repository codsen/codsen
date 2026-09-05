// Preserve ambiguous suggestions
import assert from "node:assert/strict";
import { matchTypos } from "../dist/string-typo-match.esm.js";

const result = matchTypos("nsp", ["ensp", "nbsp", "nsup"]);
assert.equal(result.status, "ambiguous");
assert.equal(result.bestMatch, null);
assert.deepEqual(
  result.matches.map(({ candidate }) => candidate),
  ["ensp", "nbsp", "nsup"],
);
