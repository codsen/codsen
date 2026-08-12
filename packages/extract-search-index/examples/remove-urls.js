// Remove URLs and stop words from search-index text

import { strict as assert } from "node:assert";

import { extract } from "../dist/extract-search-index.esm.js";

assert.equal(
  extract("Read docs at https://example.com/guide and save the docs"),
  "read docs save",
);
