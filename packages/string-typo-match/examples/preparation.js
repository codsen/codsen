// Reuse a candidate vocabulary
import assert from "node:assert/strict";
import { createMatcher } from "../dist/string-typo-match.esm.js";

const matcher = createMatcher(["screen", "print", "speech"]);
assert.equal(matcher.match("scren").bestMatch, "screen");
assert.equal(matcher.match("prnit").bestMatch, "print");
assert.equal(matcher.log.uniqueCandidateCount, 3);
