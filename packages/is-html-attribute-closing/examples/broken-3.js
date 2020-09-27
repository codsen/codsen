/* eslint import/extensions:0, no-unused-vars:0 */

// Broken #3

import { strict as assert } from "assert";
import isAttrClosing from "../dist/is-html-attribute-closing.esm";

// Correct code:
// <img class="so-called" alt="!" border='10'/>

// Broken code:
const str = `<img class="so-called "alt !' border 10'/>`;
//                      ^
//                known opening at idx 11

assert.equal(isAttrClosing(str, 11, 22), true);
// => true - indeed a closing of an attribute

assert.equal(isAttrClosing(str, 11, 28), false);
// => not a closing of an attribute

assert.equal(isAttrClosing(str, 11, 39), false);
// => not a closing of an attribute
