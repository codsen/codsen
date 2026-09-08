// Read semantic attribute selectors

import assert from "node:assert/strict";

import { extractCssSelectorTokens } from "../dist/string-extract-class-names.esm.js";

const str = String.raw`[cl\61 ss="a,b"][id=" x "]`;
const tokens = extractCssSelectorTokens(str);

assert.deepEqual(
  tokens.map(({ value }) => value),
  [".a,b", "# x "],
);
assert.ok(tokens.every(({ raw, range }) => raw === str.slice(...range)));
