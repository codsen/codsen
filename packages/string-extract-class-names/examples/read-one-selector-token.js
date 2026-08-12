// Read one selector token at an exact index

import { strict as assert } from "node:assert";

import { readCssSelectorToken } from "../dist/string-extract-class-names.esm.js";

assert.deepEqual(readCssSelectorToken("a.foo\\:bar#baz", 1), {
  value: ".foo:bar",
  raw: ".foo\\:bar",
  range: [1, 10],
});
