/* eslint no-unused-vars:0 */

import tap from "tap";
import { sort } from "../dist/csv-sort.esm";
import compare from "./util";

// Blank row cases
// -------------------------------------------------------------------

tap.test("01. blank row above header", (t) => {
  compare(t, "simples-blank-row-aboveheader");
  t.end();
});

tap.test("02. blank row above content, header row above it", (t) => {
  compare(t, "simples-blank-row-top");
  t.end();
});

tap.test("03. blank row in the middle", (t) => {
  compare(t, "simples-blank-row-middle");
  t.end();
});

tap.test("04. blank row at the bottom", (t) => {
  compare(t, "simples-blank-row-bottom");
  t.end();
});

tap.test(
  "05. one messed up field CSV will result in missing rows on that row and higher",
  (t) => {
    compare(t, "simples-messed-up");
    t.end();
  }
);

tap.test("06. one data row has extra column with data there", (t) => {
  compare(t, "simples-one-row-has-extra-cols");
  t.end();
});

tap.test(
  "07. extra column with data there, then an extra empty column everywhere (will trim it)",
  (t) => {
    compare(t, "simples-one-row-has-extra-cols-v2");
    t.end();
  }
);

tap.test(
  "08. extra column with data there, then an extra empty column everywhere (will trim it)",
  (t) => {
    t.strictSame(
      sort(""),
      {
        res: [[""]],
        msgContent: null,
        msgType: null,
      },
      "08"
    );
    t.end();
  }
);
