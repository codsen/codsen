// Trim whitespace from the start and end of every line

import { strict as assert } from "node:assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";

assert.equal(
  collapse("  first  \n   second   ", { trimLines: true }).result,
  "first\nsecond",
);
