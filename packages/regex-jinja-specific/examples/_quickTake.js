// Quick Take

import { strict as assert } from "assert";
import { isJinjaSpecific } from "../dist/regex-jinja-specific.esm.js";

assert.equal(
  isJinjaSpecific().test(`<div>{{ '%.2f'|format(3.1415926) }}</div>`),
  true
);

// in case of ambiguous, Nunjucks-or-Jinja code
assert.equal(isJinjaSpecific().test(`<div>{{ value }}</div>`), false);
