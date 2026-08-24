// A bypass callback and a do-nothing callback

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

// Accept each range proposed during callback processing:
const cb1 = ({ rangesArr, proposedReturn }) => {
  if (proposedReturn) {
    rangesArr.push(...proposedReturn);
  }
};
const result1 = stripHtml("abc<hr>def", { cb: cb1 }).result;
assert.equal(result1, "abc def");

// to prove it works, don't do anything:
const cb2 = () => {
  // nothing here 🙈
};
const result2 = stripHtml("abc<hr>def", { cb: cb2 }).result;
assert.equal(result2, "abc<hr>def");
