/* eslint no-unused-vars:0 */

import { readFileSync } from "fs";
import tap from "tap";
import path from "path";
import split from "csv-split-easy";
import csvSort from "../dist/csv-sort.esm";
import compare from "./util";

const fixtures = path.join(__dirname, "fixtures");

// 2D Trim
// -------------------------------------------------------------------

tap.test("01. trims right side cols and bottom rows", (t) => {
  compare(t, "simples-2d-trim");
  t.end();
});

tap.test("02. trims all around, including left-side empty columns", (t) => {
  compare(t, "all-round-simples-trim");
  t.end();
});
