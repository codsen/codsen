/* eslint no-unused-vars:0 */

import tap from "tap";
import compare from "./util";

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
