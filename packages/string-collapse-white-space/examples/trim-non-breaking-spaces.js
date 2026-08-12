// Trim raw non-breaking spaces with ordinary whitespace

import { strict as assert } from "node:assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";

assert.equal(
  collapse("\u00a0  value  \u00a0", { trimnbsp: true }).result,
  "value",
);
