// Quick Take

import { strict as assert } from "assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

assert.equal(
  stripHtml(`Some text <b>and</b> text.`).result,
  `Some text and text.`
);

// prevents accidental string concatenation
assert.equal(stripHtml(`aaa<div>bbb</div>ccc`).result, `aaa bbb ccc`);

// tag pairs with content, upon request
assert.equal(
  stripHtml(`a <pre><code>void a;</code></pre> b`, {
    stripTogetherWithTheirContents: [
      "script", // default
      "style", // default
      "xml", // default
      "pre", // <-- custom-added
    ],
  }).result,
  `a b`
);

// detects raw, legit brackets:
assert.equal(stripHtml(`a < b and c > d`).result, `a < b and c > d`);
