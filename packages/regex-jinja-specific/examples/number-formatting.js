// Detect Jinja's Python-style number formatting filter

import { strict as assert } from "node:assert";

import { isJinjaSpecific } from "../dist/regex-jinja-specific.esm.js";

assert.equal(isJinjaSpecific().test("{{ '%+.2f'|format(total) }}"), true);
assert.equal(isJinjaSpecific().test("{{ total }}"), false);
