// Access the complete public rule-name list

import { strict as assert } from "node:assert";

import { allRules } from "../dist/string-fix-broken-named-entities.esm.js";

assert.equal(allRules.includes("bad-html-entity-malformed-nbsp"), true);
assert.equal(allRules.includes("bad-html-entity-multiple-encoding"), true);
assert.equal(new Set(allRules).size, allRules.length);
