// Strip script tags but retain their text when paired-content removal is disabled

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

assert.equal(
  stripHtml("before<script>alert(1)</script>after", {
    stripTogetherWithTheirContents: [],
  }).result,
  "before alert(1) after",
);
