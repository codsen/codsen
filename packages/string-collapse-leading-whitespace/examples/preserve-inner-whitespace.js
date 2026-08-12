// Leave whitespace inside a multiline string unchanged

import { strict as assert } from "node:assert";

import { collWhitespace } from "../dist/string-collapse-leading-whitespace.esm.js";

assert.equal(
  collWhitespace("  abc  \n  def  \n  ghi  "),
  " abc  \n  def  \n  ghi ",
);
