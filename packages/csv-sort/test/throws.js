/* eslint no-unused-vars:0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { sort } from "../dist/csv-sort.esm.js";
import compare from "./util.js";

// -------------------------------------------------------------------

test("01. throws when it can't detect Balance column (one field is empty in this case)", () => {
  compare(equal, "throws-no-balance", throws);
});

test("02. throws when all exclusively-numeric columns contain same values per-column", () => {
  compare(equal, "throws-identical-numeric-cols", throws);
});

test("03. offset columns - will throw", () => {
  compare(equal, "offset-column", throws);
});

test("04. throws when input types are wrong", () => {
  throws(() => {
    sort(true);
  }, /THROW_ID_01/g);
  throws(() => {
    sort(null);
  }, /THROW_ID_01/g);
  throws(() => {
    sort(1);
  }, /THROW_ID_01/g);
  throws(() => {
    sort(undefined);
  }, /THROW_ID_01/g);
  throws(() => {
    sort({ a: "b" });
  }, /THROW_ID_01/g);
});

test("05. throws because there are no numeric-only columns", () => {
  compare(equal, "throws-when-no-numeric-columns", throws);
});

test.run();
