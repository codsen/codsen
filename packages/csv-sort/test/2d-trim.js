/* eslint no-unused-vars:0 */

import tap from "tap";
import compare from "./util";

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
