// Detect Jinja namespace assignment syntax

import { strict as assert } from "node:assert";

import { isJinjaSpecific } from "../dist/regex-jinja-specific.esm.js";

assert.equal(
  isJinjaSpecific().test("{% set totals = namespace(value=0) %}"),
  true,
);
