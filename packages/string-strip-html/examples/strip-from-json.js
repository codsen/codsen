/* eslint import/extensions:0, import/no-extraneous-dependencies:0 */

// Strip HTML from a raw JSON string

import { strict as assert } from "assert";
import stripHtml from "../dist/string-strip-html.esm.js";
import traverse from "../../ast-monkey-traverse";

const stripFromJsonStr = (str) => {
  return traverse(JSON.parse(str), (key, val) => {
    // if currently an object is traversed, you get both "key" and "val"
    // if it's array, only "key" is present, "val" is undefined
    const current = val !== undefined ? val : key;
    if (
      // ensure it's a plain object, not array (monkey will report only "key" in
      // arrays and "val" will be undefined)
      // also ensure object's value a string, not boolean or number, because we
      // don't strip HTML from booleans or numbers or anything else than strings
      typeof val === "string"
    ) {
      // monkey's callback is like Array.map - whatever you return gets written:
      return stripHtml(val).result;
    }
    // default return, do nothing:
    return current;
  });
};

// nothing to strip, "<" is false alarm:
assert.equal(
  JSON.stringify(stripFromJsonStr(`{"Operator":"<","IsValid":true}`), null, 0),
  `{"Operator":"<","IsValid":true}`
);

// some HTML within one of key values, monkey will skip the boolean:
assert.equal(
  JSON.stringify(
    stripFromJsonStr(`{"Operator":"a <div>b</div> c","IsValid":true}`),
    null,
    0
  ),
  `{"Operator":"a b c","IsValid":true}`
);
