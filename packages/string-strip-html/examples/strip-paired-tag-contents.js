// Remove a selected tag pair together with its contents

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

assert.equal(
  stripHtml("a <pre><code>void a;</code></pre> b", {
    stripTogetherWithTheirContents: ["script", "style", "xml", "pre"],
  }).result,
  "a b",
);
