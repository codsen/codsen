import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { chompRight } from "../dist/string-left-right.esm.js";

// chompRight()
// -----------------------------------------------------------------------------

test(`01`, () => {
  equal(chompRight("a b c d  c dx", 2, "c", "d"), 12, "01.01");
  equal(chompRight("a b c d  c d x", 2, "c", "d"), 12, "01.02");
  equal(chompRight("a b c d  c d  x", 2, "c", "d"), 13, "01.03");
  equal(chompRight("a b c d  c d \nx", 2, "c", "d"), 13, "01.04");
  equal(chompRight("a b c d  c d  \nx", 2, "c", "d"), 14, "01.05");
  // with hardcoded default opts
  let o = { mode: 0 };
  equal(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "01.06");
  equal(chompRight("a b c d  c d x", 2, o, "c", "d"), 12, "01.07");
  equal(chompRight("a b c d  c d  x", 2, o, "c", "d"), 13, "01.08");
  equal(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 13, "01.09");
  equal(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 14, "01.10");
  equal(
    chompRight("a b c d  c d  \nx", 2, { mode: "0" }, "c", "d"),
    14,
    "01.11"
  );
  equal(
    chompRight("a b c d  c d  \nx", 2, { mode: null }, "c", "d"),
    14,
    "01.12 - falsey values default to 0"
  );
  equal(
    chompRight("a b c d  c d  \nx", 2, { mode: "" }, "c", "d"),
    14,
    "01.13 - falsey values default to 0"
  );
  equal(
    chompRight("a b c d  c d  \nx", 2, { mode: undefined }, "c", "d"),
    14,
    "01.14 - falsey values default to 0"
  );
});

test(`02`, () => {
  // mode 1: stop at first space, leave the whitespace alone
  let o = { mode: 1 };
  equal(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "02.01");
  equal(chompRight("a b c d  c d x", 2, o, "c", "d"), 12, "02.02");
  equal(chompRight("a b c d  c d  x", 2, o, "c", "d"), 12, "02.03");
  equal(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 12, "02.04");
  equal(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 12, "02.05");
  equal(chompRight("a b c d  c d  \t \nx", 2, o, "c", "d"), 12, "02.06");
  equal(
    chompRight("a b c d  c d  \t \nx", 2, { mode: "1" }, "c", "d"),
    12,
    "02.07"
  );
});

test(`03`, () => {
  // mode 2: hungrily chomp all whitespace except newlines
  let o = { mode: 2 };
  equal(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "03.01");
  equal(chompRight("a b c d  c d x", 2, o, "c", "d"), 13, "03.02");
  equal(chompRight("a b c d  c d  x", 2, o, "c", "d"), 14, "03.03");
  equal(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 13, "03.04");
  equal(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 14, "03.05");
  equal(chompRight("a b c d  c d  \t \nx", 2, o, "c", "d"), 16, "03.06");
  equal(
    chompRight("a b c d  c d  \t \nx", 2, { mode: "2" }, "c", "d"),
    16,
    "03.07"
  );
});

test(`04`, () => {
  // mode 3: aggressively chomp all whitespace
  let o = { mode: 3 };
  equal(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "04.01");
  equal(chompRight("a b c d  c d x", 2, o, "c", "d"), 13, "04.02");
  equal(chompRight("a b c d  c d  x", 2, o, "c", "d"), 14, "04.03");
  equal(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 14, "04.04");
  equal(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 15, "04.05");
  equal(chompRight("a b c d  c d  \t \nx", 2, o, "c", "d"), 17, "04.06");
  equal(
    chompRight("a b c d  c d  \t \nx", 2, { mode: "3" }, "c", "d"),
    17,
    "04.07"
  );
});

test(`05`, () => {
  equal(chompRight("a b c d  c dx", 2), null, "05.01");
  equal(chompRight("a b c d  c dx", 2, "z", "x"), null, "05.02");
  equal(chompRight("a b c d  c dx", 2, { mode: 0 }, "z", "x"), null, "05.03");
  equal(chompRight("a b c d  c dx", 2, { mode: 1 }, "z", "x"), null, "05.04");
  equal(chompRight("a b c d  c dx", 2, { mode: 2 }, "z", "x"), null, "05.05");
  equal(chompRight("a b c d  c dx", 2, { mode: 3 }, "z", "x"), null, "05.06");

  // idx is too high:
  equal(chompRight("a b c d  c dx", 99, "z", "x"), null, "05.07");
  equal(chompRight("a b c d  c dx", 99, { mode: 0 }, "z", "x"), null, "05.08");
  equal(chompRight("a b c d  c dx", 99, { mode: 1 }, "z", "x"), null, "05.09");
  equal(chompRight("a b c d  c dx", 99, { mode: 2 }, "z", "x"), null, "05.10");
  equal(chompRight("a b c d  c dx", 99, { mode: 3 }, "z", "x"), null, "05.11");

  // no args -> null:
  equal(chompRight("a b c d  c dx", 2), null, "05.12");
  equal(chompRight("a b c d  c dx", 2, { mode: 0 }), null, "05.13");
  equal(chompRight("a b c d  c dx", 2, { mode: 1 }), null, "05.14");
  equal(chompRight("a b c d  c dx", 2, { mode: 2 }), null, "05.15");
  equal(chompRight("a b c d  c dx", 2, { mode: 3 }), null, "05.16");

  // idx at wrong place:
  equal(chompRight("a b c d  c d  \nx", 0, "c", "d"), null, "05.17");

  // both args optional and don't exist
  equal(chompRight("a b c d  c d  \nx", 0, "m?", "n?"), null, "05.18");
});

test(`06`, () => {
  throws(() => {
    chompRight("a b c d  c dx", 2, { mode: "z" }, "k", "l");
  }, /THROW_ID_02/);
});

test(`07`, () => {
  // stop at \n
  equal(chompRight("a b c d  c d    \n", 2, null, "c", "d"), 16, "07.01");
});

test(`08`, () => {
  // stop at \n
  equal(chompRight("a", 0, null, "x"), null, "08.01");
});

test(`09`, () => {
  equal(chompRight(1, 0, null, "x"), null, "09.01");
});

test(`10`, () => {
  equal(
    chompRight("a b c d  c d    \t", 2, { mode: 0 }, "c", "d"),
    17,
    "10.01"
  );
  equal(
    chompRight("a b c d  c d    \t", 2, { mode: 2 }, "c", "d"),
    17,
    "10.02"
  );
  equal(
    chompRight("a b c d  c d    \t", 2, { mode: 3 }, "c", "d"),
    17,
    "10.03"
  );
});

test(`11`, () => {
  equal(chompRight(`<a bcd="ef">`, 6, "="), null, "11.01");
  equal(chompRight(`<a bcd=="ef">`, 6, "="), 8, "11.02");
  equal(chompRight(`<a bcd==="ef">`, 6, "="), 9, "11.03");
  equal(chompRight(`<a bcd= ="ef">`, 6, "="), 9, "11.04");
  equal(chompRight(`<a bcd= =="ef">`, 6, "="), 10, "11.05");
  equal(chompRight(`<a bcd= = "ef">`, 6, "="), 9, "11.06");
  equal(chompRight(`<a bcd= == "ef">`, 6, "="), 10, "11.07");

  // hardcoded defaults mode === 0
  equal(chompRight(`<a bcd="ef">`, 6, { mode: 0 }, "="), null, "11.08");
  equal(chompRight(`<a bcd=="ef">`, 6, { mode: 0 }, "="), 8, "11.09");
  equal(chompRight(`<a bcd==="ef">`, 6, { mode: 0 }, "="), 9, "11.10");
  equal(chompRight(`<a bcd= ="ef">`, 6, { mode: 0 }, "="), 9, "11.11");
  equal(chompRight(`<a bcd= =="ef">`, 6, { mode: 0 }, "="), 10, "11.12");
  equal(chompRight(`<a bcd= = "ef">`, 6, { mode: 0 }, "="), 9, "11.13");
  equal(chompRight(`<a bcd= == "ef">`, 6, { mode: 0 }, "="), 10, "11.14");

  // mode === 1
  equal(chompRight(`<a bcd="ef">`, 6, { mode: 1 }, "="), null, "11.15");
  equal(chompRight(`<a bcd=="ef">`, 6, { mode: 1 }, "="), 8, "11.16");
  equal(chompRight(`<a bcd==="ef">`, 6, { mode: 1 }, "="), 9, "11.17");
  equal(chompRight(`<a bcd= ="ef">`, 6, { mode: 1 }, "="), 9, "11.18");
  equal(chompRight(`<a bcd= =="ef">`, 6, { mode: 1 }, "="), 10, "11.19");
  equal(chompRight(`<a bcd= = "ef">`, 6, { mode: 1 }, "="), 9, "11.20");
  equal(chompRight(`<a bcd= == "ef">`, 6, { mode: 1 }, "="), 10, "11.21");

  // mode === 2
  equal(chompRight(`<a bcd="ef">`, 6, { mode: 2 }, "="), null, "11.22");
  equal(chompRight(`<a bcd=="ef">`, 6, { mode: 2 }, "="), 8, "11.23");
  equal(chompRight(`<a bcd==="ef">`, 6, { mode: 2 }, "="), 9, "11.24");
  equal(chompRight(`<a bcd= ="ef">`, 6, { mode: 2 }, "="), 9, "11.25");
  equal(chompRight(`<a bcd= =="ef">`, 6, { mode: 2 }, "="), 10, "11.26");
  equal(chompRight(`<a bcd= = "ef">`, 6, { mode: 2 }, "="), 10, "11.27");
  equal(chompRight(`<a bcd= == "ef">`, 6, { mode: 2 }, "="), 11, "11.28");

  // mode === 3
  equal(chompRight(`<a bcd="ef">`, 6, { mode: 3 }, "="), null, "11.29");
  equal(chompRight(`<a bcd=="ef">`, 6, { mode: 3 }, "="), 8, "11.30");
  equal(chompRight(`<a bcd==="ef">`, 6, { mode: 3 }, "="), 9, "11.31");
  equal(chompRight(`<a bcd= ="ef">`, 6, { mode: 3 }, "="), 9, "11.32");
  equal(chompRight(`<a bcd= =="ef">`, 6, { mode: 3 }, "="), 10, "11.33");
  equal(chompRight(`<a bcd= = "ef">`, 6, { mode: 3 }, "="), 10, "11.34");
  equal(chompRight(`<a bcd= == "ef">`, 6, { mode: 3 }, "="), 11, "11.35");
});

test.run();
