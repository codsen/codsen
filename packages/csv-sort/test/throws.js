/* eslint no-unused-vars:0 */

import tap from "tap";
import { sort } from "../dist/csv-sort.esm";
import compare from "./util";

// -------------------------------------------------------------------

tap.test(
  "01. throws when it can't detect Balance column (one field is empty in this case)",
  (t) => {
    compare(t, "throws-no-balance", "check for a throw please");
    t.end();
  }
);

tap.test(
  "02. throws when all exclusively-numeric columns contain same values per-column",
  (t) => {
    compare(t, "throws-identical-numeric-cols", "check for a throw please");
    t.end();
  }
);

tap.test("03. offset columns - will throw", (t) => {
  compare(t, "offset-column", "check for a throw please");
  t.end();
});

tap.test("04. throws when input types are wrong", (t) => {
  t.throws(() => {
    sort(true);
  }, /THROW_ID_01/g);
  t.throws(() => {
    sort(null);
  }, /THROW_ID_01/g);
  t.throws(() => {
    sort(1);
  }, /THROW_ID_01/g);
  t.throws(() => {
    sort(undefined);
  }, /THROW_ID_01/g);
  t.throws(() => {
    sort({ a: "b" });
  }, /THROW_ID_01/g);

  t.end();
});

tap.test("05. throws because there are no numeric-only columns", (t) => {
  compare(t, "throws-when-no-numeric-columns", "check for a throw please");
  t.end();
});
