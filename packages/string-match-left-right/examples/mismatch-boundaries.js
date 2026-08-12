// Require boundary characters and choose hungry matching

import { strict as assert } from "node:assert";

import { matchRight } from "../dist/string-match-left-right.esm.js";

// The first character mismatches. Hungry mode lets the matcher keep looking.
assert.equal(
  matchRight("ab.def", 1, "cde", { maxMismatches: 1, hungry: true }),
  "cde",
);
assert.equal(
  matchRight("ab.def", 1, "cde", {
    maxMismatches: 1,
    hungry: true,
    firstMustMatch: true,
  }),
  false,
);

// The final character mismatches, so lastMustMatch rejects it.
assert.equal(matchRight("abcd.f", 1, "cde", { maxMismatches: 1 }), "cde");
assert.equal(
  matchRight("abcd.f", 1, "cde", {
    maxMismatches: 1,
    lastMustMatch: true,
  }),
  false,
);
