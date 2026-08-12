import { strict as assert } from "node:assert";

import { findMalformed } from "../dist/string-find-malformed.esm.js";

const findings = [];

findMalformed("< ! - -", "<!--", (finding) => findings.push(finding), {
  ignoreWhitespace: true,
});

assert.deepEqual(findings, [{ idxFrom: 0, idxTo: 7 }]);
