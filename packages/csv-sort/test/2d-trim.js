/* eslint no-unused-vars:0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import compare from "./util.js";

// 2D Trim
// -------------------------------------------------------------------

test("01. trims right side cols and bottom rows", () => {
  compare(equal, "simples-2d-trim");
});

test("02. trims all around, including left-side empty columns", () => {
  compare(equal, "all-round-simples-trim");
});

test.run();
