// Quick Take

import { strict as assert } from "node:assert";

import { extract } from "../dist/extract-search-index.esm.js";

assert.equal(
  extract("The quick brown fox jumps over the lazy dog."),
  "quick brown fox jumps over lazy dog",
);
