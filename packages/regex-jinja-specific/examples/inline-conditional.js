// Inline conditional ordering is shared by Jinja and Nunjucks

import { strict as assert } from "node:assert";

import { isJinjaSpecific } from "../dist/regex-jinja-specific.esm.js";

assert.equal(
  isJinjaSpecific().test("{{'enabled' if active else 'disabled'}}"),
  false,
);
