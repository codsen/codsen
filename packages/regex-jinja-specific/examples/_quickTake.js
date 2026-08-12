// Quick Take

import { strict as assert } from "node:assert";

import { isJinjaSpecific } from "../dist/regex-jinja-specific.esm.js";

assert.equal(
  isJinjaSpecific().test("<div>{{ '%.2f'|format(3.1415926) }}</div>"),
  true,
);
