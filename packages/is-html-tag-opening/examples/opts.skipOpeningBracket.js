// `opts.skipOpeningBracket`

import { strict as assert } from "assert";
import { isOpening } from "../dist/is-html-tag-opening.esm.js";

// missing opening bracket:
assert.equal(isOpening(`<a>div class="w-64 h-3">`, 3), false);
//                         ^
// result is instant "false" because `idx` has to be
// on an opening bracket (besides checking for tag name
// being present and recognised and attributes being present)

// but with opts.skipOpeningBracket we remove the requirement
// that "idx" has to be on a bracket - algorithm detects valid
// tag name and the attribute that follows and recognise it's a
// tag starting:
assert.equal(
  isOpening(`<a>div class="w-64 h-3">`, 3, {
    skipOpeningBracket: true,
  }),
  true
);
