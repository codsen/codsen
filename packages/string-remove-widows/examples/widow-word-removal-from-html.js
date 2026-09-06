// Widow word removal from text within HTML

import { strict as assert } from "node:assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

const someHtml = `<p>
  <a href="https://example.com" class="underline font-bold">
    Foo Bar
  </a>
</p>`;

// Element tags and their attributes are preserved automatically.
// Lower the default four-word minimum to protect this two-word phrase.
assert.equal(
  removeWidows(someHtml, { minWordCount: 2 }).res,
  someHtml.replace("Foo Bar", "Foo&nbsp;Bar"),
);
