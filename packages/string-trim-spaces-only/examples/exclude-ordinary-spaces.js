// Trim tabs but preserve ordinary spaces at the edges

import { strict as assert } from "node:assert";

import { trimSpaces } from "../dist/string-trim-spaces-only.esm.js";

assert.equal(
  trimSpaces("\t  value  \t", { space: false, tab: true }).res,
  "  value  ",
);
