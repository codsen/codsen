/* eslint no-unused-vars:0 */

import { readFileSync } from "fs";
import tap from "tap";
import path from "path";
import split from "csv-split-easy";
import csvSort from "../dist/csv-sort.esm";
import compare from "./util";

const fixtures = path.join(__dirname, "fixtures");

// Simple file, concentrate on row sorting, Balance, Credit & Debit col detection
// -------------------------------------------------------------------

tap.test("01. sorts a basic file, empty extra column in header", (t) => {
  compare(t, "simples");
  t.end();
});

tap.test("02. sorts a basic file, no headers", (t) => {
  compare(t, "simples-no-header");
  t.end();
});

tap.test(
  "03. sorts a basic file with opposite order of the CSV entries",
  (t) => {
    compare(t, "simples-backwards");
    t.end();
  }
);
