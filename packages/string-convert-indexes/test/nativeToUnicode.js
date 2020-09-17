import tap from "tap";
import { nativeToUnicode } from "../dist/string-convert-indexes.esm";

// single-length characters only:
// -----------------------------------------------------------------------------

tap.test("01 - one letter string", (t) => {
  t.is(nativeToUnicode("a", 0), 0, "01.01");
  t.is(nativeToUnicode("a", "0"), "0", "01.02");
  t.end();
});

tap.test("02 - non-emoji indexes match completely", (t) => {
  const source = `  \n\n\r \t\t\t\t \r\r sljg dflgfhkf23647834563iuerhgkdjgxkf \n \r      \r sljl djflkgjd \r slfslj \n\n\n\n\n\n\n....`;
  source.split("").forEach((char, idx) => {
    t.is(nativeToUnicode(source, idx), idx, `02/${idx}`);
  });
  t.end();
});

// multiple-length characters
// -----------------------------------------------------------------------------

tap.only("03 - 2-long emojis", (t) => {
  t.is(nativeToUnicode("👍", 0), 0, "03.01");
  t.is(nativeToUnicode("👍", 1), 0, "03.02");

  t.is(nativeToUnicode("a👍", 0), 0, "03.03");
  t.is(nativeToUnicode("a👍", 1), 1, "03.04");
  t.is(nativeToUnicode("a👍", 2), 1, "03.05");

  t.is(nativeToUnicode("👍👍", 0), 0, "03.06");
  t.is(nativeToUnicode("👍👍", 1), 0, "03.07");
  t.is(nativeToUnicode("👍👍", 2), 1, "03.08");
  t.is(nativeToUnicode("👍👍", 3), 1, "03.09");

  t.end();
});

tap.test("04 - 6-long emojis", (t) => {
  t.is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 0), 0, "04.01");
  t.is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 1), 0, "04.02");
  t.is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 2), 0, "04.03");
  t.is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 3), 0, "04.04");
  t.is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 4), 0, "04.05");
  t.is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 5), 0, "04.06");

  t.is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 6), 1, "04.07");
  t.is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 7), 1, "04.08");
  t.is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 8), 1, "04.09");
  t.is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 9), 1, "04.10");
  t.is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 10), 1, "04.11");
  t.is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 11), 1, "04.12");

  t.end();
});

tap.test("05 - emojis mix", (t) => {
  t.is(nativeToUnicode("a👍b🏳️‍🌈c", 0), 0, "05.01");
  t.is(nativeToUnicode("a👍b🏳️‍🌈c", 1), 1, "05.02");
  t.is(nativeToUnicode("a👍b🏳️‍🌈c", 2), 1, "05.03");
  t.is(nativeToUnicode("a👍b🏳️‍🌈c", 3), 2, "05.04");
  t.is(nativeToUnicode("a👍b🏳️‍🌈c", 4), 3, "05.05");
  t.is(nativeToUnicode("a👍b🏳️‍🌈c", 5), 3, "05.06");
  t.is(nativeToUnicode("a👍b🏳️‍🌈c", 6), 3, "05.07");
  t.is(nativeToUnicode("a👍b🏳️‍🌈c", 7), 3, "05.08");
  t.is(nativeToUnicode("a👍b🏳️‍🌈c", 8), 3, "05.09");
  t.is(nativeToUnicode("a👍b🏳️‍🌈c", 9), 3, "05.10");
  t.is(nativeToUnicode("a👍b🏳️‍🌈c", 10), 4, "05.11");
  t.is(nativeToUnicode("a👍b🏳️‍🌈c", "10"), "4", "05.12");

  t.end();
});

// other
// -----------------------------------------------------------------------------

tap.test("06 - two astral characters offsetting the rest", (t) => {
  t.strictSame(
    nativeToUnicode("\uD834\uDF06aa", [0, 1, 2, 3]),
    [0, 0, 1, 2],
    "06 - all unique"
  );
  t.end();
});

tap.test("07 - non-emoji indexes match completely", (t) => {
  const source = `  \n\n\r \t\t\t\t \r\r sljg dflgfhkf23647834563iuerhgkdjgxkf \n \r      \r sljl djflkgjd \r slfslj \n\n\n\n\n\n\n....`;
  source.split("").forEach((char, idx) => {
    t.is(nativeToUnicode(source, idx), idx, "01");
  });
  t.end();
});

tap.test("08 - two astral characters offsetting the rest", (t) => {
  t.strictSame(
    nativeToUnicode("\uD834\uDF06aa", ["0", "1", "2", "3"]),
    ["0", "0", "1", "2"],
    "08"
  );
  t.end();
});

tap.test("09 - two astral characters offsetting the rest", (t) => {
  t.strictSame(
    nativeToUnicode("\uD834\uDF06aa", [0, 2, 0, 1, 2, 3]),
    [0, 1, 0, 0, 1, 2],
    "09 - with dupes"
  );
  t.end();
});

tap.test("10 - two astral characters offsetting the rest", (t) => {
  t.strictSame(
    nativeToUnicode("\uD834\uDF06aa", ["0", "2", "0", "1", "2", "3"]),
    ["0", "1", "0", "0", "1", "2"],
    "10"
  );
  t.end();
});

tap.test(
  "11 - a stray astral surrogate without second counterpart counts as symbol",
  (t) => {
    t.strictSame(
      nativeToUnicode("\uD834\uDF06a\uDF06a", [0, 1, 2, 3, 4]),
      [0, 0, 1, 2, 3],
      "11"
    );
    t.end();
  }
);

tap.test("12 - one letter string", (t) => {
  t.is(nativeToUnicode("a", 0), 0, "12");
  t.end();
});

tap.test("13 - single astral symbol", (t) => {
  t.is(nativeToUnicode("\uD834\uDF06", 0), 0, "13.01");
  t.is(nativeToUnicode("\uD834\uDF06", 1), 0, "13.02");
  t.throws(() => {
    nativeToUnicode("\uD834\uDF06", 2);
  }, "13.03");
  t.end();
});

tap.test("14 - six-char long, single-grapheme emoji", (t) => {
  t.is(nativeToUnicode("\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08", 0), 0, "14.01");
  t.is(nativeToUnicode("\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08", 1), 0, "14.02");
  t.is(nativeToUnicode("\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08", 2), 0, "14.03");
  t.is(nativeToUnicode("\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08", 3), 0, "14.04");
  t.is(nativeToUnicode("\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08", 4), 0, "14.05");
  t.is(nativeToUnicode("\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08", 5), 0, "14.06");
  t.end();
});

tap.test("15 - two six-char long, single-grapheme emoji", (t) => {
  t.is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      0
    ),
    0,
    "15.01"
  );
  t.is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      1
    ),
    0,
    "15.02"
  );
  t.is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      2
    ),
    0,
    "15.03"
  );
  t.is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      3
    ),
    0,
    "15.04"
  );
  t.is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      4
    ),
    0,
    "15.05"
  );
  t.is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      5
    ),
    0,
    "15.06"
  );

  t.is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      6
    ),
    1,
    "15.07"
  );
  t.is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      7
    ),
    1,
    "15.08"
  );
  t.is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      8
    ),
    1,
    "15.09"
  );
  t.is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      9
    ),
    1,
    "15.10"
  );
  t.is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      10
    ),
    1,
    "15.11"
  );
  t.is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      11
    ),
    1,
    "15.12"
  );
  t.end();
});

tap.test("16 - multiple consecutive astral symbols", (t) => {
  t.strictSame(
    nativeToUnicode("\uD834\uDF06aa", [1, "0", [[[2]]], 3]),
    [0, "0", [[[1]]], 2],
    "16"
  );
  t.end();
});
