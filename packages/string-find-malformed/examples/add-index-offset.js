// Offset the reported indexes

import { strict as assert } from "node:assert";

import { findMalformed } from "../dist/string-find-malformed.esm.js";

const findings = [];

findMalformed(
  "<div><!-something--></div>",
  "<!--",
  (finding) => findings.push(finding),
  {
    maxDistance: 1,
    stringOffset: 100,
  },
);

assert.deepEqual(findings, [{ idxFrom: 105, idxTo: 108 }]);
