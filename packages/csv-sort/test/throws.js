/* eslint no-unused-vars:0 */

import { readFileSync } from "fs";
import tap from "tap";
import path from "path";
import split from "csv-split-easy";
import csvSort from "../dist/csv-sort.esm";
import compare from "./util";

// -------------------------------------------------------------------

tap.test(
  "01. throws when it can't detect Balance column (one field is empty in this case)",
  (t) => {
    compare(t, "throws-no-balance", 1);
    t.end();
  }
);

tap.test(
  "02. throws when all exclusively-numeric columns contain same values per-column",
  (t) => {
    compare(t, "throws-identical-numeric-cols", 1);
    t.end();
  }
);

tap.test("03. offset columns - will throw", (t) => {
  compare(t, "offset-column", 1);
  t.end();
});

tap.test("04. throws because there are no numeric-only columns", (t) => {
  compare(t, "throws-when-no-numeric-columns", 1);
  t.end();
});

tap.test("05. throws when input types are wrong", (t) => {
  t.throws(() => {
    csvSort(true);
  }, /THROW_ID_02/g);
  t.throws(() => {
    csvSort(null);
  }, /THROW_ID_02/g);
  t.throws(() => {
    csvSort(1);
  }, /THROW_ID_02/g);
  t.throws(() => {
    csvSort(undefined);
  }, /THROW_ID_02/g);
  t.throws(() => {
    csvSort({ a: "b" });
  }, /THROW_ID_02/g);
  t.throws(() => {
    csvSort(["c", "d"]);
  }, /THROW_ID_01/g);

  t.end();
});
