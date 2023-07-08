// Quick Take

import { strict as assert } from "assert";

import { extract } from "../dist/extract-search-index.esm.js";

assert.equal(
  extract("The quick brown fox jumps over the lazy dog."),
  "quick brown fox jumps over lazy dog",
);

// works with HTML, strips tags
assert.equal(extract("<tralala><div>some&nbsp;text</div>"), "some text");
