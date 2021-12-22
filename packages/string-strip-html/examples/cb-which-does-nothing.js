/* eslint-disable no-unused-vars */
// A Bypass Callback and a Do-Nothing Callback

import { strict as assert } from "assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

// this callback just pushes proposed result to "rangesArr",
// that's what gets used in the result calculation:
const cb1 = ({
  tag,
  deleteFrom,
  deleteTo,
  insert,
  rangesArr,
  proposedReturn,
}) => {
  rangesArr.push(deleteFrom, deleteTo, insert);
};
const result1 = stripHtml("abc<hr>def", { cb: cb1 }).result;
assert.equal(result1, `abc def`);

// to prove it works, don't do anything:
const cb2 = ({
  tag,
  deleteFrom,
  deleteTo,
  insert,
  rangesArr,
  proposedReturn,
}) => {
  // nothing here 🙈
};
const result2 = stripHtml("abc<hr>def", { cb: cb2 }).result;
assert.equal(result2, "abc<hr>def");
