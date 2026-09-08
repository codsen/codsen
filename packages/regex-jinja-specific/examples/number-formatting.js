// Find Jinja format filter markers, including whitespace around the call

import { strict as assert } from "node:assert";

import { isJinjaSpecific } from "../dist/regex-jinja-specific.esm.js";

assert.equal(isJinjaSpecific().test("{{ '%+.2f'|format(total) }}"), true);
assert.equal(isJinjaSpecific().test("{{ '%s' | format (name) }}"), true);
assert.deepEqual("{{ '%s' | format (name) }}".match(isJinjaSpecific()), [
  "| format (",
]);
assert.equal(
  isJinjaSpecific().test("{{ '%s' | formatSomething(name) }}"),
  false,
);
assert.equal(isJinjaSpecific().test("{{ total }}"), false);
