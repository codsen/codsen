// Remove empty lines from multiline text

import { strict as assert } from "node:assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";

assert.equal(
  collapse("first\n\nsecond", { removeEmptyLines: true }).result,
  "first\nsecond",
);
