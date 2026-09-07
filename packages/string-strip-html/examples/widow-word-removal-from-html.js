// Prevent widow words while preserving HTML

import { strict as assert } from "node:assert";
import { removeWidows } from "../../string-remove-widows/dist/string-remove-widows.esm.js";
import { stripHtml } from "../dist/string-strip-html.esm.js";

const someHtml =
  '<p class="underline font-bold">The quick brown fox jumps over the lazy dog.</p>';
const expected =
  '<p class="underline font-bold">The quick brown fox jumps over the lazy&nbsp;dog.</p>';

// HTML tags and their attributes are protected automatically.
assert.equal(removeWidows(someHtml).res, expected);

// Reuse exact tag spans when stripHtml() has already scanned the same input.
// Its removal ranges can include surrounding whitespace; use allTagLocations.
const { allTagLocations } = stripHtml(someHtml);
assert.equal(
  removeWidows(someHtml, {
    tagRanges: allTagLocations,
  }).res,
  expected,
);
