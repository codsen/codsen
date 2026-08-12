// Trim every JavaScript whitespace character

import { strict as assert } from "node:assert";

import { trimSpaces } from "../dist/string-trim-spaces-only.esm.js";

assert.equal(
  trimSpaces(" \t\n value \r\n ", { classicTrim: true }).res,
  "value",
);
