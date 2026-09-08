// Preserve BMP letters while separating words around surrogate code units

import { strict as assert } from "node:assert";

import { extract } from "../dist/extract-search-index.esm.js";

assert.equal(extract("ＦＯＯ ＦＯＯ foo豈更bar"), "ｆｏｏ foo豈更bar");
assert.equal(extract("before😊after"), "before after");
assert.equal(extract("before&#x1F60A;after"), "before after");
assert.equal(
  extract("Read https://example.com/😊private manual"),
  "read manual",
);
