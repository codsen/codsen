/* eslint no-unused-vars:0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { sort } from "../dist/csv-sort.esm.js";
import compare from "./util.js";

// Blank row cases
// -------------------------------------------------------------------

test("01. blank row above header", () => {
  compare(equal, "simples-blank-row-aboveheader");
});

test("02. blank row above content, header row above it", () => {
  compare(equal, "simples-blank-row-top");
});

test("03. blank row in the middle", () => {
  compare(equal, "simples-blank-row-middle");
});

test("04. blank row at the bottom", () => {
  compare(equal, "simples-blank-row-bottom");
});

test("05. one messed up field CSV will result in missing rows on that row and higher", () => {
  compare(equal, "simples-messed-up");
});

test("06. one data row has extra column with data there", () => {
  compare(equal, "simples-one-row-has-extra-cols");
});

test("07. extra column with data there, then an extra empty column everywhere (will trim it)", () => {
  compare(equal, "simples-one-row-has-extra-cols-v2");
});

test("08. extra column with data there, then an extra empty column everywhere (will trim it)", () => {
  equal(
    sort(""),
    {
      res: [[""]],
      msgContent: null,
      msgType: null,
    },
    "08"
  );
});

test.run();
