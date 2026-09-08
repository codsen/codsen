// Characters rejected in attribute names

import { strict as assert } from "node:assert";

import { isAttrNameChar } from "../dist/is-char-suitable-for-html-attr-name.esm.js";

for (const value of ["=", "/", ">", "<", " ", "", 1, undefined]) {
  assert.equal(isAttrNameChar(value), false);
}
