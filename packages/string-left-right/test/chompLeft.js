import tap from "tap";
import { chompLeft } from "../dist/string-left-right.esm";

// chompLeft()
// -----------------------------------------------------------------------------

tap.test(`01`, (t) => {
  t.equal(chompLeft("a  b c b c  x y", 12, "b", "c"), 2, "01");
  t.end();
});

tap.test(`02`, (t) => {
  t.equal(chompLeft("ab c b c  x y", 10, "b", "c"), 1, "02.01");
  t.equal(chompLeft("a b c b c  x y", 11, "b", "c"), 2, "02.02");
  t.equal(chompLeft("a  b c b c  x y", 12, "b", "c"), 2, "02.03");
  t.equal(chompLeft("a\n b c b c  x y", 12, "b", "c"), 2, "02.04");
  t.equal(chompLeft("a\n  b c b c  x y", 13, "b", "c"), 2, "02.05");

  // with hardcoded default opts
  const o = { mode: 0 };
  t.equal(chompLeft("ab c b c  x y", 10, o, "b", "c"), 1, "02.06");
  t.equal(chompLeft("a b c b c  x y", 11, o, "b", "c"), 2, "02.07");
  t.equal(chompLeft("a  b c b c  x y", 12, o, "b", "c"), 2, "02.08");
  t.equal(chompLeft("a\n b c b c  x y", 12, o, "b", "c"), 2, "02.09");
  t.equal(chompLeft("a\n  b c b c  x y", 13, o, "b", "c"), 2, "02.10");
  t.equal(
    chompLeft("a\n  b c b c  x y", 12, { mode: "0" }, "b", "c"),
    2,
    "02.11"
  );
  t.equal(
    chompLeft("a\n  b c b c  x y", 12, { mode: null }, "b", "c"),
    2,
    "02.12"
  );
  t.equal(
    chompLeft("a\n  b c b c  x y", 12, { mode: "" }, "b", "c"),
    2,
    "02.13"
  );
  t.equal(
    chompLeft("a\n  b c b c  x y", 12, { mode: undefined }, "b", "c"),
    2,
    "02.14"
  );
  t.equal(chompLeft("a\n  b c b c  x y", 13, "b", "c", "x?"), 2, "02.15");
  t.equal(chompLeft("a\n  b c b c  x y", 13, "y?", "b", "c", "x?"), 2, "02.16");
  t.end();
});

tap.test(`03`, (t) => {
  // mode 1: stop at first space, leave the whitespace alone
  const o = { mode: 1 };
  t.equal(chompLeft("ab c b c  x y", 10, o, "b", "c"), 1, "03.01");
  t.equal(chompLeft("a b c b c  x y", 11, o, "b", "c"), 2, "03.02");
  t.equal(chompLeft("a  b c b c  x y", 12, o, "b", "c"), 3, "03.03");
  t.equal(chompLeft("a\n b c b c  x y", 12, o, "b", "c"), 3, "03.04");
  t.equal(chompLeft("a\n  b c b c  x y", 13, o, "b", "c"), 4, "03.05");
  t.equal(
    chompLeft("a\n  b c b c  x y", 12, { mode: "1" }, "b", "c"),
    4,
    "03.06"
  );
  t.end();
});

tap.test(`04`, (t) => {
  // mode 2: hungrily chomp all whitespace except newlines
  const o = { mode: 2 };
  t.equal(chompLeft("ab c b c  x y", 10, o, "b", "c"), 1, "04.01");
  t.equal(chompLeft("a b c b c  x y", 11, o, "b", "c"), 1, "04.02");
  t.equal(chompLeft("a  b c b c  x y", 12, o, "b", "c"), 1, "04.03");
  t.equal(chompLeft("a\n b c b c  x y", 12, o, "b", "c"), 2, "04.04");
  t.equal(chompLeft("a\n  b c b c  x y", 13, o, "b", "c"), 2, "04.05");
  t.equal(
    chompLeft("a\n  b c b c  x y", 12, { mode: "2" }, "b", "c"),
    2,
    "04.06"
  );
  t.end();
});

tap.test(`05`, (t) => {
  // mode 3: aggressively chomp all whitespace
  const o = { mode: 3 };
  t.equal(chompLeft("ab c b c  x y", 10, o, "b", "c"), 1, "05.01");
  t.equal(chompLeft("a b c b c  x y", 11, o, "b", "c"), 1, "05.02");
  t.equal(chompLeft("a  b c b c  x y", 12, o, "b", "c"), 1, "05.03");
  t.equal(chompLeft("a\n b c b c  x y", 12, o, "b", "c"), 1, "05.04");
  t.equal(chompLeft("a\n  b c b c  x y", 13, o, "b", "c"), 1, "05.05");
  t.equal(
    chompLeft("a\n  b c b c  x y", 12, { mode: "3" }, "b", "c"),
    1,
    "05.06"
  );
  t.equal(
    chompLeft("a\n  b c b c  x y", 12, { mode: "3" }, "b", "c?"),
    1,
    "05.07"
  );
  t.end();
});

tap.test(`06`, (t) => {
  t.equal(chompLeft("ab c b c  x y", -1), null, "06.01");
  t.equal(chompLeft("ab c b c  x y", 0), null, "06.02");
  t.equal(chompLeft("ab c b c  x y", 10), null, "06.03");
  t.equal(chompLeft("ab c b c  x y", 10, "z", "x"), null, "06.04");
  t.equal(chompLeft("ab c b c  x y", 10, { mode: 0 }, "z", "x"), null, "06.05");
  t.equal(chompLeft("ab c b c  x y", 10, { mode: 1 }, "z", "x"), null, "06.06");
  t.equal(chompLeft("ab c b c  x y", 10, { mode: 2 }, "z", "x"), null, "06.07");
  t.equal(chompLeft("ab c b c  x y", 10, { mode: 3 }, "z", "x"), null, "06.08");

  // idx is zero/negative:
  t.equal(chompLeft("a b c d  c dx", 0, "z", "x"), null, "06.09");
  t.equal(chompLeft("a b c d  c dx", 0, { mode: 0 }, "z", "x"), null, "06.10");
  t.equal(chompLeft("a b c d  c dx", 0, { mode: 1 }, "z", "x"), null, "06.11");
  t.equal(chompLeft("a b c d  c dx", 0, { mode: 2 }, "z", "x"), null, "06.12");
  t.equal(chompLeft("a b c d  c dx", 0, { mode: 3 }, "z", "x"), null, "06.13");

  t.equal(chompLeft("a b c d  c dx", 99, "z", "x"), null, "06.14");
  t.equal(chompLeft("a b c d  c dx", 99, { mode: 0 }, "z", "x"), null, "06.15");
  t.equal(chompLeft("a b c d  c dx", 99, { mode: 1 }, "z", "x"), null, "06.16");
  t.equal(chompLeft("a b c d  c dx", 99, { mode: 2 }, "z", "x"), null, "06.17");
  t.equal(chompLeft("a b c d  c dx", 99, { mode: 3 }, "z", "x"), null, "06.18");

  // no args -> null:
  t.equal(chompLeft("a b c d  c dx", 2), null, "06.19");
  t.equal(chompLeft("a b c d  c dx", 2, { mode: 0 }), null, "06.20");
  t.equal(chompLeft("a b c d  c dx", 2, { mode: 1 }), null, "06.21");
  t.equal(chompLeft("a b c d  c dx", 2, { mode: 2 }), null, "06.22");
  t.equal(chompLeft("a b c d  c dx", 2, { mode: 3 }), null, "06.23");
  t.end();
});

tap.test(`07`, (t) => {
  t.throws(() => {
    chompLeft("a b c d  c dx", 2, { mode: "z" }, "k", "l");
  }, /THROW_ID_01/);
  t.end();
});

tap.test(`08`, (t) => {
  // stop at \n
  t.equal(chompLeft(" \n  b c   b  c   x y", 17, null, "b", "c"), 2, "08");
  t.end();
});

tap.test(`09`, (t) => {
  t.equal(
    chompLeft("         b c   b  c   x y", 22, { mode: 2 }, "b", "c"),
    0,
    "09"
  );
  t.end();
});

tap.test(`10`, (t) => {
  t.equal(
    chompLeft("a        b c   b  c   x y", 22, { mode: 2 }, "b", "c"),
    1,
    "10.01"
  );
  t.equal(
    chompLeft("a        b c   b  c   x y", 22, { mode: 3 }, "b", "c"),
    1,
    "10.02"
  );
  t.end();
});

tap.test(`11`, (t) => {
  t.equal(chompLeft(1, 22, { mode: 2 }, "b", "c"), null, "11");
  t.end();
});

tap.test(`12`, (t) => {
  t.equal(
    chompLeft("\t        b c   b  c   x y", 22, { mode: 0 }, "b", "c"),
    0,
    "12.01"
  );
  t.equal(
    chompLeft("\t        b c   b  c   x y", 22, { mode: 2 }, "b", "c"),
    0,
    "12.02"
  );
  t.equal(
    chompLeft("\t        b c   b  c   x y", 22, { mode: 3 }, "b", "c"),
    0,
    "12.03"
  );
  t.end();
});

tap.test(`13`, (t) => {
  t.equal(
    chompLeft("a        b c   b  c   x y", 22, { mode: 0 }, "b", "c"),
    2,
    "13.01"
  );
  t.equal(
    chompLeft("a        b c   b  c   x y", 22, { mode: 0 }, "b?", "c?"),
    2,
    "13.02"
  );
  t.equal(
    chompLeft("a        b c   b  c   x y", 22, { mode: 0 }, "x?", "b", "c"),
    2,
    "13.03"
  );
  t.end();
});

tap.test(`14`, (t) => {
  t.equal(chompLeft(`<a bcd="ef">`, 6, "="), null, "14.01");
  t.equal(chompLeft(`<a bcd=="ef">`, 7, "="), 6, "14.02");
  t.equal(chompLeft(`<a bcd==="ef">`, 8, "="), 6, "14.03");
  t.equal(chompLeft(`<a bcd= ="ef">`, 8, "="), 6, "14.04");
  t.equal(chompLeft(`<a bcd= = ="ef">`, 10, "="), 6, "14.05");

  // hardcoded default, mode === 0
  t.equal(chompLeft(`<a bcd="ef">`, 6, { mode: 0 }, "="), null, "14.06");
  t.equal(chompLeft(`<a bcd=="ef">`, 7, { mode: 0 }, "="), 6, "14.07");
  t.equal(chompLeft(`<a bcd==="ef">`, 8, { mode: 0 }, "="), 6, "14.08");
  t.equal(chompLeft(`<a bcd= ="ef">`, 8, { mode: 0 }, "="), 6, "14.09");
  t.equal(chompLeft(`<a bcd= = ="ef">`, 10, { mode: 0 }, "="), 6, "14.10");

  // mode === 1
  t.equal(chompLeft(`<a bcd="ef">`, 6, { mode: 1 }, "="), null, "14.11");
  t.equal(chompLeft(`<a bcd=="ef">`, 7, { mode: 1 }, "="), 6, "14.12");
  t.equal(chompLeft(`<a bcd==="ef">`, 8, { mode: 1 }, "="), 6, "14.13");
  t.equal(chompLeft(`<a bcd= ="ef">`, 8, { mode: 1 }, "="), 6, "14.14");
  t.equal(chompLeft(`<a bcd= = ="ef">`, 10, { mode: 1 }, "="), 6, "14.15");

  // mode === 2
  t.equal(chompLeft(`<a bcd="ef">`, 6, { mode: 2 }, "="), null, "14.16");
  t.equal(chompLeft(`<a bcd=="ef">`, 7, { mode: 2 }, "="), 6, "14.17");
  t.equal(chompLeft(`<a bcd==="ef">`, 8, { mode: 2 }, "="), 6, "14.18");
  t.equal(chompLeft(`<a bcd= ="ef">`, 8, { mode: 2 }, "="), 6, "14.19");
  t.equal(chompLeft(`<a bcd= = ="ef">`, 10, { mode: 2 }, "="), 6, "14.20");

  // mode === 3
  t.equal(chompLeft(`<a bcd="ef">`, 6, { mode: 3 }, "="), null, "14.21");
  t.equal(chompLeft(`<a bcd=="ef">`, 7, { mode: 3 }, "="), 6, "14.22");
  t.equal(chompLeft(`<a bcd==="ef">`, 8, { mode: 3 }, "="), 6, "14.23");
  t.equal(chompLeft(`<a bcd= ="ef">`, 8, { mode: 3 }, "="), 6, "14.24");
  t.equal(chompLeft(`<a bcd= = ="ef">`, 10, { mode: 3 }, "="), 6, "14.25");
  t.end();
});

tap.test(`15`, (t) => {
  t.equal(
    chompLeft(`<!!! ! ! ! ! ! ! ! ![CDATA[some stuff]]>`, 20, "!"),
    1,
    "15.01"
  );
  t.equal(
    chompLeft(`<!!! ! ! ! ! ! ! ! ![CDATA[some stuff]]>`, 19, "!"),
    1,
    "15.02"
  );
  t.equal(
    chompLeft(`<!!! ! ! ! ! ! ! ! ![CDATA[some stuff]]>`, 18, "!"),
    1,
    "15.03"
  );
  t.equal(
    chompLeft(`<!!! ! ! ! ! ! ! ! ![CDATA[some stuff]]>`, 17, "!"),
    1,
    "15.04"
  );
  t.end();
});

tap.test(`16`, (t) => {
  t.equal(chompLeft(`. . . . . ....   . x`, 19, ".*"), 0, "16");
  t.end();
});

tap.test(`17`, (t) => {
  t.equal(
    chompLeft(`<  << <  << < !! !! ! ! [[[ [ [[  [ x`, 36, "<*", "!*", "[*"),
    0,
    "17"
  );
  t.end();
});
