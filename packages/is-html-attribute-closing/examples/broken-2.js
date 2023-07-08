// Broken #2

import { strict as assert } from "assert";

import { isAttrClosing } from "../dist/is-html-attribute-closing.esm.js";

assert.equal(
  isAttrClosing(
    "<a b = = = \"c\" d = = = 'e'>",
    //          ^ ^
    //          | |
    //          | L_______________________________
    //          |                                |
    11, // known opening                         |
    13, // is this an attribute closing at index 13?
  ),
  true,
);
// => true - indeed a closing of an attribute (not counting
// the code is broken)
