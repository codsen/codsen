// Broken #1

import { strict as assert } from "assert";
import { isAttrClosing } from "../dist/is-html-attribute-closing.esm.js";

assert.equal(
  isAttrClosing(
    `<a href="z' click here</a>`,
    //       ^ ^
    //       | \
    //       |  \_________________________________
    //       |                                   |
    8, // known opening                          |
    10 // is this an attribute closing at index 10?
  ),
  true
);
// => yes, indeed a closing of an attribute (not counting
// the code is broken)
