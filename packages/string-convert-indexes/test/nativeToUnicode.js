// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { nativeToUnicode } from "../dist/string-convert-indexes.esm.js";

// single-length characters only:
// -----------------------------------------------------------------------------

test("01 - one letter string", () => {
  is(nativeToUnicode("a", 0), 0, "01.01");
  is(nativeToUnicode("a", "0"), "0", "01.02");
});

test("02 - non-emoji indexes match completely", () => {
  let source =
    "  \n\n\r \t\t\t\t \r\r sljg dflgfhkf23647834563iuerhgkdjgxkf \n \r      \r sljl djflkgjd \r slfslj \n\n\n\n\n\n\n....";
  source.split("").forEach((char, idx) => {
    is(nativeToUnicode(source, idx), idx, `02/${idx}`);
  });
});

// multiple-length characters
// -----------------------------------------------------------------------------

test("03 - 2-long emojis", () => {
  is(nativeToUnicode("👍", 0), 0, "03.01");
  is(nativeToUnicode("👍", 1), 0, "03.02");

  is(nativeToUnicode("a👍", 0), 0, "03.03");
  is(nativeToUnicode("a👍", 1), 1, "03.04");
  is(nativeToUnicode("a👍", 2), 1, "03.05");

  is(nativeToUnicode("👍👍", 0), 0, "03.06");
  is(nativeToUnicode("👍👍", 1), 0, "03.07");
  is(nativeToUnicode("👍👍", 2), 1, "03.08");
  is(nativeToUnicode("👍👍", 3), 1, "03.09");
});

test("04 - 6-long emojis", () => {
  is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 0), 0, "04.01");
  is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 1), 0, "04.02");
  is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 2), 0, "04.03");
  is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 3), 0, "04.04");
  is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 4), 0, "04.05");
  is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 5), 0, "04.06");

  is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 6), 1, "04.07");
  is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 7), 1, "04.08");
  is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 8), 1, "04.09");
  is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 9), 1, "04.10");
  is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 10), 1, "04.11");
  is(nativeToUnicode("🏳️‍🌈🏳️‍🌈", 11), 1, "04.12");
});

test("05 - emojis mix", () => {
  is(nativeToUnicode("a👍b🏳️‍🌈c", 0), 0, "05.01");
  is(nativeToUnicode("a👍b🏳️‍🌈c", 1), 1, "05.02");
  is(nativeToUnicode("a👍b🏳️‍🌈c", 2), 1, "05.03");
  is(nativeToUnicode("a👍b🏳️‍🌈c", 3), 2, "05.04");
  is(nativeToUnicode("a👍b🏳️‍🌈c", 4), 3, "05.05");
  is(nativeToUnicode("a👍b🏳️‍🌈c", 5), 3, "05.06");
  is(nativeToUnicode("a👍b🏳️‍🌈c", 6), 3, "05.07");
  is(nativeToUnicode("a👍b🏳️‍🌈c", 7), 3, "05.08");
  is(nativeToUnicode("a👍b🏳️‍🌈c", 8), 3, "05.09");
  is(nativeToUnicode("a👍b🏳️‍🌈c", 9), 3, "05.10");
  is(nativeToUnicode("a👍b🏳️‍🌈c", 10), 4, "05.11");
  is(nativeToUnicode("a👍b🏳️‍🌈c", "10"), "4", "05.12");
});

// other
// -----------------------------------------------------------------------------

test("06 - two astral characters offsetting the rest", () => {
  equal(nativeToUnicode("\uD834\uDF06aa", [0, 1, 2, 3]), [0, 0, 1, 2], "06.01");
});

test("07 - non-emoji indexes match completely", () => {
  let source =
    "  \n\n\r \t\t\t\t \r\r sljg dflgfhkf23647834563iuerhgkdjgxkf \n \r      \r sljl djflkgjd \r slfslj \n\n\n\n\n\n\n....";
  source.split("").forEach((char, idx) => {
    is(nativeToUnicode(source, idx), idx, "01");
  });
});

test("08 - two astral characters offsetting the rest", () => {
  equal(
    nativeToUnicode("\uD834\uDF06aa", ["0", "1", "2", "3"]),
    ["0", "0", "1", "2"],
    "08.01",
  );
});

test("09 - two astral characters offsetting the rest", () => {
  equal(
    nativeToUnicode("\uD834\uDF06aa", [0, 2, 0, 1, 2, 3]),
    [0, 1, 0, 0, 1, 2],
    "09.01",
  );
});

test("10 - two astral characters offsetting the rest", () => {
  equal(
    nativeToUnicode("\uD834\uDF06aa", ["0", "2", "0", "1", "2", "3"]),
    ["0", "1", "0", "0", "1", "2"],
    "10.01",
  );
});

test("11 - a stray astral surrogate without second counterpart counts as symbol", () => {
  equal(
    nativeToUnicode("\uD834\uDF06a\uDF06a", [0, 1, 2, 3, 4]),
    [0, 0, 1, 2, 3],
    "11.01",
  );
});

test("12 - one letter string", () => {
  is(nativeToUnicode("a", 0), 0, "12.01");
});

test("13 - single astral symbol", () => {
  is(nativeToUnicode("\uD834\uDF06", 0), 0, "13.01");
  is(nativeToUnicode("\uD834\uDF06", 1), 0, "13.02");
  throws(
    () => {
      nativeToUnicode("\uD834\uDF06", 2);
    },
    "13.03",
    "13.03",
  );
});

test("14 - six-char long, single-grapheme emoji", () => {
  is(nativeToUnicode("\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08", 0), 0, "14.01");
  is(nativeToUnicode("\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08", 1), 0, "14.02");
  is(nativeToUnicode("\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08", 2), 0, "14.03");
  is(nativeToUnicode("\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08", 3), 0, "14.04");
  is(nativeToUnicode("\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08", 4), 0, "14.05");
  is(nativeToUnicode("\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08", 5), 0, "14.06");
});

test("15 - two six-char long, single-grapheme emoji", () => {
  is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      0,
    ),
    0,
    "15.01",
  );
  is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      1,
    ),
    0,
    "15.02",
  );
  is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      2,
    ),
    0,
    "15.03",
  );
  is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      3,
    ),
    0,
    "15.04",
  );
  is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      4,
    ),
    0,
    "15.05",
  );
  is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      5,
    ),
    0,
    "15.06",
  );

  is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      6,
    ),
    1,
    "15.07",
  );
  is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      7,
    ),
    1,
    "15.08",
  );
  is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      8,
    ),
    1,
    "15.09",
  );
  is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      9,
    ),
    1,
    "15.10",
  );
  is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      10,
    ),
    1,
    "15.11",
  );
  is(
    nativeToUnicode(
      "\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08",
      11,
    ),
    1,
    "15.12",
  );
});

test("16 - multiple consecutive astral symbols", () => {
  equal(
    nativeToUnicode("\uD834\uDF06aa", [1, "0", [[[2]]], 3]),
    [0, "0", [[[1]]], 2],
    "16.01",
  );
});

test("17 - modern emoji ZWJ sequence", () => {
  equal(
    nativeToUnicode("a🧑‍🤝‍🧑b", [1, 2, 3, 4, 5, 6, 7, 8, 9]),
    [1, 1, 1, 1, 1, 1, 1, 1, 2],
    "17.01",
  );
});

test.run();
