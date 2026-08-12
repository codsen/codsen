// Exclude code, preformatted text, and CSS from the index

import { strict as assert } from "node:assert";

import { extract } from "../dist/extract-search-index.esm.js";

assert.equal(
  extract(
    "Before <code>const secret = true</code> after <style>.hidden{}</style>",
  ),
  "before after",
);
