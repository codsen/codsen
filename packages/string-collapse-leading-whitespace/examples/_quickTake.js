/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import collWhitespace from "../dist/string-collapse-leading-whitespace.esm.js";

// if leading/trailing whitespace doesn't contain \n, collapse to a single space
assert.equal(collWhitespace("  aaa   "), " aaa ");

// otherwise, collapse to a single \n (default setting)
assert.equal(collWhitespace("     \n\n   aaa  \n\n\n    "), "\naaa\n");

// does nothing to trimmed strings:
assert.equal(collWhitespace("aaa"), "aaa");

// if there are multiple lines string is still processed in trim-fashion -
// only beginning and ending whitespace is changed:
assert.equal(
  collWhitespace("  abc  \n  def  \n  ghi  "),
  " abc  \n  def  \n  ghi "
);
