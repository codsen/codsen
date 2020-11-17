import tap from "tap";
import { chompRight } from "../dist/string-left-right.esm";

// chompRight()
// -----------------------------------------------------------------------------

tap.test(`01`, (t) => {
  t.equal(chompRight("a b c d  c dx", 2, "c", "d"), 12, "01.01");
  t.equal(chompRight("a b c d  c d x", 2, "c", "d"), 12, "01.02");
  t.equal(chompRight("a b c d  c d  x", 2, "c", "d"), 13, "01.03");
  t.equal(chompRight("a b c d  c d \nx", 2, "c", "d"), 13, "01.04");
  t.equal(chompRight("a b c d  c d  \nx", 2, "c", "d"), 14, "01.05");
  // with hardcoded default opts
  const o = { mode: 0 };
  t.equal(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "01.06");
  t.equal(chompRight("a b c d  c d x", 2, o, "c", "d"), 12, "01.07");
  t.equal(chompRight("a b c d  c d  x", 2, o, "c", "d"), 13, "01.08");
  t.equal(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 13, "01.09");
  t.equal(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 14, "01.10");
  t.equal(
    chompRight("a b c d  c d  \nx", 2, { mode: "0" }, "c", "d"),
    14,
    "01.11"
  );
  t.equal(
    chompRight("a b c d  c d  \nx", 2, { mode: null }, "c", "d"),
    14,
    "01.12 - falsey values default to 0"
  );
  t.equal(
    chompRight("a b c d  c d  \nx", 2, { mode: "" }, "c", "d"),
    14,
    "01.13 - falsey values default to 0"
  );
  t.equal(
    chompRight("a b c d  c d  \nx", 2, { mode: undefined }, "c", "d"),
    14,
    "01.14 - falsey values default to 0"
  );
  t.end();
});

tap.test(`02`, (t) => {
  // mode 1: stop at first space, leave the whitespace alone
  const o = { mode: 1 };
  t.equal(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "02.01");
  t.equal(chompRight("a b c d  c d x", 2, o, "c", "d"), 12, "02.02");
  t.equal(chompRight("a b c d  c d  x", 2, o, "c", "d"), 12, "02.03");
  t.equal(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 12, "02.04");
  t.equal(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 12, "02.05");
  t.equal(chompRight("a b c d  c d  \t \nx", 2, o, "c", "d"), 12, "02.06");
  t.equal(
    chompRight("a b c d  c d  \t \nx", 2, { mode: "1" }, "c", "d"),
    12,
    "02.07"
  );
  t.end();
});

tap.test(`03`, (t) => {
  // mode 2: hungrily chomp all whitespace except newlines
  const o = { mode: 2 };
  t.equal(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "03.01");
  t.equal(chompRight("a b c d  c d x", 2, o, "c", "d"), 13, "03.02");
  t.equal(chompRight("a b c d  c d  x", 2, o, "c", "d"), 14, "03.03");
  t.equal(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 13, "03.04");
  t.equal(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 14, "03.05");
  t.equal(chompRight("a b c d  c d  \t \nx", 2, o, "c", "d"), 16, "03.06");
  t.equal(
    chompRight("a b c d  c d  \t \nx", 2, { mode: "2" }, "c", "d"),
    16,
    "03.07"
  );
  t.end();
});

tap.test(`04`, (t) => {
  // mode 3: aggressively chomp all whitespace
  const o = { mode: 3 };
  t.equal(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "04.01");
  t.equal(chompRight("a b c d  c d x", 2, o, "c", "d"), 13, "04.02");
  t.equal(chompRight("a b c d  c d  x", 2, o, "c", "d"), 14, "04.03");
  t.equal(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 14, "04.04");
  t.equal(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 15, "04.05");
  t.equal(chompRight("a b c d  c d  \t \nx", 2, o, "c", "d"), 17, "04.06");
  t.equal(
    chompRight("a b c d  c d  \t \nx", 2, { mode: "3" }, "c", "d"),
    17,
    "04.07"
  );
  t.end();
});

tap.test(`05`, (t) => {
  t.equal(chompRight("a b c d  c dx", 2), null, "05.01");
  t.equal(chompRight("a b c d  c dx", 2, "z", "x"), null, "05.02");
  t.equal(chompRight("a b c d  c dx", 2, { mode: 0 }, "z", "x"), null, "05.03");
  t.equal(chompRight("a b c d  c dx", 2, { mode: 1 }, "z", "x"), null, "05.04");
  t.equal(chompRight("a b c d  c dx", 2, { mode: 2 }, "z", "x"), null, "05.05");
  t.equal(chompRight("a b c d  c dx", 2, { mode: 3 }, "z", "x"), null, "05.06");

  // idx is too high:
  t.equal(chompRight("a b c d  c dx", 99, "z", "x"), null, "05.07");
  t.equal(
    chompRight("a b c d  c dx", 99, { mode: 0 }, "z", "x"),
    null,
    "05.08"
  );
  t.equal(
    chompRight("a b c d  c dx", 99, { mode: 1 }, "z", "x"),
    null,
    "05.09"
  );
  t.equal(
    chompRight("a b c d  c dx", 99, { mode: 2 }, "z", "x"),
    null,
    "05.10"
  );
  t.equal(
    chompRight("a b c d  c dx", 99, { mode: 3 }, "z", "x"),
    null,
    "05.11"
  );

  // no args -> null:
  t.equal(chompRight("a b c d  c dx", 2), null, "05.12");
  t.equal(chompRight("a b c d  c dx", 2, { mode: 0 }), null, "05.13");
  t.equal(chompRight("a b c d  c dx", 2, { mode: 1 }), null, "05.14");
  t.equal(chompRight("a b c d  c dx", 2, { mode: 2 }), null, "05.15");
  t.equal(chompRight("a b c d  c dx", 2, { mode: 3 }), null, "05.16");

  // idx at wrong place:
  t.equal(chompRight("a b c d  c d  \nx", 0, "c", "d"), null, "05.17");

  // both args optional and don't exist
  t.equal(chompRight("a b c d  c d  \nx", 0, "m?", "n?"), null, "05.18");
  t.end();
});

tap.test(`06`, (t) => {
  t.throws(() => {
    chompRight("a b c d  c dx", 2, { mode: "z" }, "k", "l");
  }, /THROW_ID_02/);
  t.end();
});

tap.test(`07`, (t) => {
  // stop at \n
  t.equal(chompRight("a b c d  c d    \n", 2, null, "c", "d"), 16, "07");
  t.end();
});

tap.test(`08`, (t) => {
  // stop at \n
  t.equal(chompRight("a", 0, null, "x"), null, "08");
  t.end();
});

tap.test(`09`, (t) => {
  t.equal(chompRight(1, 0, null, "x"), null, "09");
  t.end();
});

tap.test(`10`, (t) => {
  t.equal(
    chompRight("a b c d  c d    \t", 2, { mode: 0 }, "c", "d"),
    17,
    "10.01"
  );
  t.equal(
    chompRight("a b c d  c d    \t", 2, { mode: 2 }, "c", "d"),
    17,
    "10.02"
  );
  t.equal(
    chompRight("a b c d  c d    \t", 2, { mode: 3 }, "c", "d"),
    17,
    "10.03"
  );
  t.end();
});

tap.test(`11`, (t) => {
  t.equal(chompRight(`<a bcd="ef">`, 6, "="), null, "11.01");
  t.equal(chompRight(`<a bcd=="ef">`, 6, "="), 8, "11.02");
  t.equal(chompRight(`<a bcd==="ef">`, 6, "="), 9, "11.03");
  t.equal(chompRight(`<a bcd= ="ef">`, 6, "="), 9, "11.04");
  t.equal(chompRight(`<a bcd= =="ef">`, 6, "="), 10, "11.05");
  t.equal(chompRight(`<a bcd= = "ef">`, 6, "="), 9, "11.06");
  t.equal(chompRight(`<a bcd= == "ef">`, 6, "="), 10, "11.07");

  // hardcoded defaults mode === 0
  t.equal(chompRight(`<a bcd="ef">`, 6, { mode: 0 }, "="), null, "11.08");
  t.equal(chompRight(`<a bcd=="ef">`, 6, { mode: 0 }, "="), 8, "11.09");
  t.equal(chompRight(`<a bcd==="ef">`, 6, { mode: 0 }, "="), 9, "11.10");
  t.equal(chompRight(`<a bcd= ="ef">`, 6, { mode: 0 }, "="), 9, "11.11");
  t.equal(chompRight(`<a bcd= =="ef">`, 6, { mode: 0 }, "="), 10, "11.12");
  t.equal(chompRight(`<a bcd= = "ef">`, 6, { mode: 0 }, "="), 9, "11.13");
  t.equal(chompRight(`<a bcd= == "ef">`, 6, { mode: 0 }, "="), 10, "11.14");

  // mode === 1
  t.equal(chompRight(`<a bcd="ef">`, 6, { mode: 1 }, "="), null, "11.15");
  t.equal(chompRight(`<a bcd=="ef">`, 6, { mode: 1 }, "="), 8, "11.16");
  t.equal(chompRight(`<a bcd==="ef">`, 6, { mode: 1 }, "="), 9, "11.17");
  t.equal(chompRight(`<a bcd= ="ef">`, 6, { mode: 1 }, "="), 9, "11.18");
  t.equal(chompRight(`<a bcd= =="ef">`, 6, { mode: 1 }, "="), 10, "11.19");
  t.equal(chompRight(`<a bcd= = "ef">`, 6, { mode: 1 }, "="), 9, "11.20");
  t.equal(chompRight(`<a bcd= == "ef">`, 6, { mode: 1 }, "="), 10, "11.21");

  // mode === 2
  t.equal(chompRight(`<a bcd="ef">`, 6, { mode: 2 }, "="), null, "11.22");
  t.equal(chompRight(`<a bcd=="ef">`, 6, { mode: 2 }, "="), 8, "11.23");
  t.equal(chompRight(`<a bcd==="ef">`, 6, { mode: 2 }, "="), 9, "11.24");
  t.equal(chompRight(`<a bcd= ="ef">`, 6, { mode: 2 }, "="), 9, "11.25");
  t.equal(chompRight(`<a bcd= =="ef">`, 6, { mode: 2 }, "="), 10, "11.26");
  t.equal(chompRight(`<a bcd= = "ef">`, 6, { mode: 2 }, "="), 10, "11.27");
  t.equal(chompRight(`<a bcd= == "ef">`, 6, { mode: 2 }, "="), 11, "11.28");

  // mode === 3
  t.equal(chompRight(`<a bcd="ef">`, 6, { mode: 3 }, "="), null, "11.29");
  t.equal(chompRight(`<a bcd=="ef">`, 6, { mode: 3 }, "="), 8, "11.30");
  t.equal(chompRight(`<a bcd==="ef">`, 6, { mode: 3 }, "="), 9, "11.31");
  t.equal(chompRight(`<a bcd= ="ef">`, 6, { mode: 3 }, "="), 9, "11.32");
  t.equal(chompRight(`<a bcd= =="ef">`, 6, { mode: 3 }, "="), 10, "11.33");
  t.equal(chompRight(`<a bcd= = "ef">`, 6, { mode: 3 }, "="), 10, "11.34");
  t.equal(chompRight(`<a bcd= == "ef">`, 6, { mode: 3 }, "="), 11, "11.35");
  t.end();
});
