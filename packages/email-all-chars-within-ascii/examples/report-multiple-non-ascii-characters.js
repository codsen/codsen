import { strict as assert } from "node:assert";

import { within } from "../dist/email-all-chars-within-ascii.esm.js";

const findings = within("H\u00e9llo\nM\u00fcnchen");

assert.equal(findings.length, 2);
assert.equal(findings[0].value, "\u00e9");
assert.equal(findings[0].line, 1);
assert.equal(findings[1].value, "\u00fc");
assert.equal(findings[1].line, 2);
