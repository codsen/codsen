// Remove one trailing slash

import { strict as assert } from "node:assert";

import { removeTrailingSlash } from "../dist/codsen-utils.esm.js";

assert.equal(
  removeTrailingSlash("https://example.com/"),
  "https://example.com",
);
assert.equal(removeTrailingSlash("path//"), "path/");
assert.equal(removeTrailingSlash(42), 42);
