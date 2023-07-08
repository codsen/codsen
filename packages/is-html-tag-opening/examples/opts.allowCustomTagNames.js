// `opts.allowCustomTagNames`

import { strict as assert } from "assert";

import { isOpening } from "../dist/is-html-tag-opening.esm.js";

// recognised tag
assert.equal(isOpening("abc <div>", 4), true);
//                          ^

// unrecognised tag
assert.equal(isOpening("abc <zzz>", 4), false);
//                          ^

// but with opts.allowCustomTagNames result is "true"
assert.equal(
  isOpening("abc <zzz>", 4, {
    allowCustomTagNames: true,
  }),
  true,
);
