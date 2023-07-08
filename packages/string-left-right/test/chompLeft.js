import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { chompLeft } from "../dist/string-left-right.esm.js";

// chompLeft()
// -----------------------------------------------------------------------------

test("01", () => {
  equal(chompLeft("a  b c b c  x y", 12, "b", "c"), 2, "01.01");
});

test("02", () => {
  equal(chompLeft("ab c b c  x y", 10, "b", "c"), 1, "02.01");
  equal(chompLeft("a b c b c  x y", 11, "b", "c"), 2, "02.02");
  equal(chompLeft("a  b c b c  x y", 12, "b", "c"), 2, "02.03");
  equal(chompLeft("a\n b c b c  x y", 12, "b", "c"), 2, "02.04");
  equal(chompLeft("a\n  b c b c  x y", 13, "b", "c"), 2, "02.05");

  // with hardcoded default opts
  let o = { mode: 0 };
  equal(chompLeft("ab c b c  x y", 10, o, "b", "c"), 1, "02.06");
  equal(chompLeft("a b c b c  x y", 11, o, "b", "c"), 2, "02.07");
  equal(chompLeft("a  b c b c  x y", 12, o, "b", "c"), 2, "02.08");
  equal(chompLeft("a\n b c b c  x y", 12, o, "b", "c"), 2, "02.09");
  equal(chompLeft("a\n  b c b c  x y", 13, o, "b", "c"), 2, "02.10");
  equal(
    chompLeft("a\n  b c b c  x y", 12, { mode: "0" }, "b", "c"),
    2,
    "02.11",
  );
  equal(
    chompLeft("a\n  b c b c  x y", 12, { mode: null }, "b", "c"),
    2,
    "02.12",
  );
  equal(chompLeft("a\n  b c b c  x y", 12, { mode: "" }, "b", "c"), 2, "02.13");
  equal(
    chompLeft("a\n  b c b c  x y", 12, { mode: undefined }, "b", "c"),
    2,
    "02.14",
  );
  equal(chompLeft("a\n  b c b c  x y", 13, "b", "c", "x?"), 2, "02.15");
  equal(chompLeft("a\n  b c b c  x y", 13, "y?", "b", "c", "x?"), 2, "02.16");
});

test("03", () => {
  // mode 1: stop at first space, leave the whitespace alone
  let o = { mode: 1 };
  equal(chompLeft("ab c b c  x y", 10, o, "b", "c"), 1, "03.01");
  equal(chompLeft("a b c b c  x y", 11, o, "b", "c"), 2, "03.02");
  equal(chompLeft("a  b c b c  x y", 12, o, "b", "c"), 3, "03.03");
  equal(chompLeft("a\n b c b c  x y", 12, o, "b", "c"), 3, "03.04");
  equal(chompLeft("a\n  b c b c  x y", 13, o, "b", "c"), 4, "03.05");
  equal(
    chompLeft("a\n  b c b c  x y", 12, { mode: "1" }, "b", "c"),
    4,
    "03.06",
  );
});

test("04", () => {
  // mode 2: hungrily chomp all whitespace except newlines
  let o = { mode: 2 };
  equal(chompLeft("ab c b c  x y", 10, o, "b", "c"), 1, "04.01");
  equal(chompLeft("a b c b c  x y", 11, o, "b", "c"), 1, "04.02");
  equal(chompLeft("a  b c b c  x y", 12, o, "b", "c"), 1, "04.03");
  equal(chompLeft("a\n b c b c  x y", 12, o, "b", "c"), 2, "04.04");
  equal(chompLeft("a\n  b c b c  x y", 13, o, "b", "c"), 2, "04.05");
  equal(
    chompLeft("a\n  b c b c  x y", 12, { mode: "2" }, "b", "c"),
    2,
    "04.06",
  );
});

test("05", () => {
  // mode 3: aggressively chomp all whitespace
  let o = { mode: 3 };
  equal(chompLeft("ab c b c  x y", 10, o, "b", "c"), 1, "05.01");
  equal(chompLeft("a b c b c  x y", 11, o, "b", "c"), 1, "05.02");
  equal(chompLeft("a  b c b c  x y", 12, o, "b", "c"), 1, "05.03");
  equal(chompLeft("a\n b c b c  x y", 12, o, "b", "c"), 1, "05.04");
  equal(chompLeft("a\n  b c b c  x y", 13, o, "b", "c"), 1, "05.05");
  equal(
    chompLeft("a\n  b c b c  x y", 12, { mode: "3" }, "b", "c"),
    1,
    "05.06",
  );
  equal(
    chompLeft("a\n  b c b c  x y", 12, { mode: "3" }, "b", "c?"),
    1,
    "05.07",
  );
});

test("06", () => {
  equal(chompLeft("ab c b c  x y", -1), null, "06.01");
  equal(chompLeft("ab c b c  x y", 0), null, "06.02");
  equal(chompLeft("ab c b c  x y", 10), null, "06.03");
  equal(chompLeft("ab c b c  x y", 10, "z", "x"), null, "06.04");
  equal(chompLeft("ab c b c  x y", 10, { mode: 0 }, "z", "x"), null, "06.05");
  equal(chompLeft("ab c b c  x y", 10, { mode: 1 }, "z", "x"), null, "06.06");
  equal(chompLeft("ab c b c  x y", 10, { mode: 2 }, "z", "x"), null, "06.07");
  equal(chompLeft("ab c b c  x y", 10, { mode: 3 }, "z", "x"), null, "06.08");

  // idx is zero/negative:
  equal(chompLeft("a b c d  c dx", 0, "z", "x"), null, "06.09");
  equal(chompLeft("a b c d  c dx", 0, { mode: 0 }, "z", "x"), null, "06.10");
  equal(chompLeft("a b c d  c dx", 0, { mode: 1 }, "z", "x"), null, "06.11");
  equal(chompLeft("a b c d  c dx", 0, { mode: 2 }, "z", "x"), null, "06.12");
  equal(chompLeft("a b c d  c dx", 0, { mode: 3 }, "z", "x"), null, "06.13");

  equal(chompLeft("a b c d  c dx", 99, "z", "x"), null, "06.14");
  equal(chompLeft("a b c d  c dx", 99, { mode: 0 }, "z", "x"), null, "06.15");
  equal(chompLeft("a b c d  c dx", 99, { mode: 1 }, "z", "x"), null, "06.16");
  equal(chompLeft("a b c d  c dx", 99, { mode: 2 }, "z", "x"), null, "06.17");
  equal(chompLeft("a b c d  c dx", 99, { mode: 3 }, "z", "x"), null, "06.18");

  // no args -> null:
  equal(chompLeft("a b c d  c dx", 2), null, "06.19");
  equal(chompLeft("a b c d  c dx", 2, { mode: 0 }), null, "06.20");
  equal(chompLeft("a b c d  c dx", 2, { mode: 1 }), null, "06.21");
  equal(chompLeft("a b c d  c dx", 2, { mode: 2 }), null, "06.22");
  equal(chompLeft("a b c d  c dx", 2, { mode: 3 }), null, "06.23");
});

test("07", () => {
  throws(
    () => {
      chompLeft("a b c d  c dx", 2, { mode: "z" }, "k", "l");
    },
    /THROW_ID_01/,
    "07.01",
  );
});

test("08", () => {
  // stop at \n
  equal(chompLeft(" \n  b c   b  c   x y", 17, null, "b", "c"), 2, "08.01");
});

test("09", () => {
  equal(
    chompLeft("         b c   b  c   x y", 22, { mode: 2 }, "b", "c"),
    0,
    "09.01",
  );
});

test("10", () => {
  equal(
    chompLeft("a        b c   b  c   x y", 22, { mode: 2 }, "b", "c"),
    1,
    "10.01",
  );
  equal(
    chompLeft("a        b c   b  c   x y", 22, { mode: 3 }, "b", "c"),
    1,
    "10.02",
  );
});

test("11", () => {
  equal(chompLeft(1, 22, { mode: 2 }, "b", "c"), null, "11.01");
});

test("12", () => {
  equal(
    chompLeft("\t        b c   b  c   x y", 22, { mode: 0 }, "b", "c"),
    0,
    "12.01",
  );
  equal(
    chompLeft("\t        b c   b  c   x y", 22, { mode: 2 }, "b", "c"),
    0,
    "12.02",
  );
  equal(
    chompLeft("\t        b c   b  c   x y", 22, { mode: 3 }, "b", "c"),
    0,
    "12.03",
  );
});

test("13", () => {
  equal(
    chompLeft("a        b c   b  c   x y", 22, { mode: 0 }, "b", "c"),
    2,
    "13.01",
  );
  equal(
    chompLeft("a        b c   b  c   x y", 22, { mode: 0 }, "b?", "c?"),
    2,
    "13.02",
  );
  equal(
    chompLeft("a        b c   b  c   x y", 22, { mode: 0 }, "x?", "b", "c"),
    2,
    "13.03",
  );
});

test("14", () => {
  equal(chompLeft('<a bcd="ef">', 6, "="), null, "14.01");
  equal(chompLeft('<a bcd=="ef">', 7, "="), 6, "14.02");
  equal(chompLeft('<a bcd==="ef">', 8, "="), 6, "14.03");
  equal(chompLeft('<a bcd= ="ef">', 8, "="), 6, "14.04");
  equal(chompLeft('<a bcd= = ="ef">', 10, "="), 6, "14.05");

  // hardcoded default, mode === 0
  equal(chompLeft('<a bcd="ef">', 6, { mode: 0 }, "="), null, "14.06");
  equal(chompLeft('<a bcd=="ef">', 7, { mode: 0 }, "="), 6, "14.07");
  equal(chompLeft('<a bcd==="ef">', 8, { mode: 0 }, "="), 6, "14.08");
  equal(chompLeft('<a bcd= ="ef">', 8, { mode: 0 }, "="), 6, "14.09");
  equal(chompLeft('<a bcd= = ="ef">', 10, { mode: 0 }, "="), 6, "14.10");

  // mode === 1
  equal(chompLeft('<a bcd="ef">', 6, { mode: 1 }, "="), null, "14.11");
  equal(chompLeft('<a bcd=="ef">', 7, { mode: 1 }, "="), 6, "14.12");
  equal(chompLeft('<a bcd==="ef">', 8, { mode: 1 }, "="), 6, "14.13");
  equal(chompLeft('<a bcd= ="ef">', 8, { mode: 1 }, "="), 6, "14.14");
  equal(chompLeft('<a bcd= = ="ef">', 10, { mode: 1 }, "="), 6, "14.15");

  // mode === 2
  equal(chompLeft('<a bcd="ef">', 6, { mode: 2 }, "="), null, "14.16");
  equal(chompLeft('<a bcd=="ef">', 7, { mode: 2 }, "="), 6, "14.17");
  equal(chompLeft('<a bcd==="ef">', 8, { mode: 2 }, "="), 6, "14.18");
  equal(chompLeft('<a bcd= ="ef">', 8, { mode: 2 }, "="), 6, "14.19");
  equal(chompLeft('<a bcd= = ="ef">', 10, { mode: 2 }, "="), 6, "14.20");

  // mode === 3
  equal(chompLeft('<a bcd="ef">', 6, { mode: 3 }, "="), null, "14.21");
  equal(chompLeft('<a bcd=="ef">', 7, { mode: 3 }, "="), 6, "14.22");
  equal(chompLeft('<a bcd==="ef">', 8, { mode: 3 }, "="), 6, "14.23");
  equal(chompLeft('<a bcd= ="ef">', 8, { mode: 3 }, "="), 6, "14.24");
  equal(chompLeft('<a bcd= = ="ef">', 10, { mode: 3 }, "="), 6, "14.25");
});

test("15", () => {
  equal(
    chompLeft("<!!! ! ! ! ! ! ! ! ![CDATA[some stuff]]>", 20, "!"),
    1,
    "15.01",
  );
  equal(
    chompLeft("<!!! ! ! ! ! ! ! ! ![CDATA[some stuff]]>", 19, "!"),
    1,
    "15.02",
  );
  equal(
    chompLeft("<!!! ! ! ! ! ! ! ! ![CDATA[some stuff]]>", 18, "!"),
    1,
    "15.03",
  );
  equal(
    chompLeft("<!!! ! ! ! ! ! ! ! ![CDATA[some stuff]]>", 17, "!"),
    1,
    "15.04",
  );
});

test("16", () => {
  equal(chompLeft(". . . . . ....   . x", 19, ".*"), 0, "16.01");
});

test("17", () => {
  equal(
    chompLeft("<  << <  << < !! !! ! ! [[[ [ [[  [ x", 36, "<*", "!*", "[*"),
    0,
    "17.01",
  );
});

test.run();
