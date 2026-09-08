// Parse attribute boundaries before decoding retained text

import { strict as assert } from "node:assert";

import { extract } from "../dist/extract-search-index.esm.js";

assert.equal(extract('<p title="&quot;&gt;secret">visible</p>'), "visible");
assert.equal(
  extract("before &amp;lt;code&amp;gt;hidden&amp;lt;/code&amp;gt; after"),
  "before after",
);
