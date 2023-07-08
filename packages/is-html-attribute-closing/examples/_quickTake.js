// Quick Take

import { strict as assert } from "assert";

import { isAttrClosing } from "../dist/is-html-attribute-closing.esm.js";

const str = '<a href="zzz" target="_blank" style="color: black;">';

// <a href="zzz" target="_blank" ...
//                      ^
//                  index 21

// <a href="zzz" target="_blank" ...
//                             ^
//                         index 28

assert.equal(
  isAttrClosing(
    str, // reference string
    21, // known opening (or in absence of a quote, a start of a value)
    28, // we ask, is this a closing on the attribute?
  ),
  true, // the answer
);
