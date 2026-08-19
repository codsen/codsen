// An exact match is not reported

import { strict as assert } from "node:assert";

import { findMalformed } from "../dist/string-find-malformed.esm.js";

const findings = [];

findMalformed("<div><!-- note --></div>", "<!--", (finding) =>
  findings.push(finding),
);

assert.deepEqual(findings, []);
