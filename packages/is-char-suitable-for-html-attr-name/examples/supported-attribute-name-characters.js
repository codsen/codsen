// Characters allowed in attribute names

import { strict as assert } from "node:assert";

import { isAttrNameChar } from "../dist/is-char-suitable-for-html-attr-name.esm.js";

for (const char of [
  "a",
  "Z",
  "0",
  "-",
  ":",
  "_",
  ".",
  "é",
  "中",
  "😀",
  "\u00a0",
]) {
  assert.equal(isAttrNameChar(char), true);
}
