/* eslint-disable @typescript-eslint/no-unused-vars */

import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import compare from "./util.js";

// Simple file, concentrate on row sorting, Balance, Credit & Debit col detection
// -------------------------------------------------------------------

test("01. sorts a basic file, empty extra column in header", () => {
  compare(equal, "simples");
});

test("02. sorts a basic file, no headers", () => {
  compare(equal, "simples-no-header");
});

test("03. sorts a basic file with opposite order of the CSV entries", () => {
  compare(equal, "simples-backwards");
});

test.run();
