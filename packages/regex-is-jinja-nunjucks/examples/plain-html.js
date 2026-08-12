// Reject HTML without Jinja or Nunjucks delimiters

import { strict as assert } from "node:assert";

import { isJinjaNunjucksRegex } from "../dist/regex-is-jinja-nunjucks.esm.js";

assert.equal(isJinjaNunjucksRegex().test("<div>Plain text</div>"), false);
