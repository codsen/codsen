// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { sort } from "../dist/csv-sort.esm.js";
import compare from "./util.js";

// Blank row cases
// -------------------------------------------------------------------

test("01 - blank row above header", () => {
  compare(equal, "simples-blank-row-aboveheader", "01");
});

test("02 - blank row above content, header row above it", () => {
  compare(equal, "simples-blank-row-top", "02");
});

test("03 - blank row in the middle", () => {
  compare(equal, "simples-blank-row-middle", "03");
});

test("04 - blank row at the bottom", () => {
  compare(equal, "simples-blank-row-bottom", "04");
});

test("05 - one messed up field CSV will result in missing rows on that row and higher", () => {
  compare(equal, "simples-messed-up", "05");
});

test("06 - one data row has extra column with data there", () => {
  compare(equal, "simples-one-row-has-extra-cols", "06");
});

test("07 - extra column with data there, then an extra empty column everywhere (will trim it)", () => {
  compare(equal, "simples-one-row-has-extra-cols-v2", "07");
});

test("08 - extra column with data there, then an extra empty column everywhere (will trim it)", () => {
  equal(
    sort(""),
    {
      res: [[""]],
      msgContent: null,
      msgType: null,
    },
    "08.01",
  );
});

test.run();
