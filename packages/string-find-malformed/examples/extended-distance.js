// Widen the allowed edit distance

import { strict as assert } from "node:assert";

import { findMalformed } from "../dist/string-find-malformed.esm.js";

const findings = [];

findMalformed("abcabcd.f", "abcdef", (finding) => findings.push(finding), {
  maxDistance: 2,
});

assert.deepEqual(findings, [{ idxFrom: 3, idxTo: 9 }]);
