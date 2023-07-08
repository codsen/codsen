// Widow word removal from text within HTML

import { strict as assert } from "assert";
import { stripHtml } from "string-strip-html";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

const someHtml = 'The quick brown fox jumps of the lazy dog.<div class="a">';

// default widow word removal libs are not aware of HTML:
// -----------------------------------------------------------------------------

assert.equal(
  removeWidows(someHtml).res,
  'The quick brown fox jumps of the lazy dog.<div&nbsp;class="a">', // 😱
);

// luckily, removeWidows() consumes optional HTML tag locations
assert.equal(
  removeWidows(someHtml, {
    tagRanges: stripHtml(someHtml)
      // remove the third argument, what to insert ("&nbsp;" string in these cases)
      .ranges.map(([from, to]) => [from, to]),
  }).res,
  'The quick brown fox jumps of the lazy&nbsp;dog.<div class="a">', // ✅
);
