// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { unicodeToNative } from "../dist/string-convert-indexes.esm.js";

// single-length characters only:
// -----------------------------------------------------------------------------

test("01 - one letter string", () => {
  is(unicodeToNative("a", 0), 0, "01.01");
  is(unicodeToNative("a", "0"), "0", "01.02");
});

test("02 - non-emoji indexes match completely", () => {
  let source =
    "  \n\n\r \t\t\t\t \r\r sljg dflgfhkf23647834563iuerhgkdjgxkf \n \r      \r sljl djflkgjd \r slfslj \n\n\n\n\n\n\n....";
  source.split("").forEach((char, idx) => {
    is(unicodeToNative(source, idx), idx, `02/${idx}`);
  });
});

// multiple-length characters
// -----------------------------------------------------------------------------

test("03 - one letter string", () => {
  // 2-long emojis
  is(unicodeToNative("👍", 0), 0, "03.01");
  is(unicodeToNative("👍👍", 0), 0, "03.02");
  is(unicodeToNative("👍👍", 1), 2, "03.03");
  is(unicodeToNative("👍👍", 1), 2, "03.04");

  // 6-long emojis
  is(unicodeToNative("🏳️‍🌈🏳️‍🌈", 0), 0, "03.05");
  is(unicodeToNative("🏳️‍🌈🏳️‍🌈", 1), 6, "03.06");

  // mix
  is(unicodeToNative("a👍b🏳️‍🌈c", 0), 0, "03.07");
  is(unicodeToNative("a👍b🏳️‍🌈c", 1), 1, "03.08");
  is(unicodeToNative("a👍b🏳️‍🌈c", 2), 3, "03.09");
  is(unicodeToNative("a👍b🏳️‍🌈c", 3), 4, "03.10");
  is(unicodeToNative("a👍b🏳️‍🌈c", 4), 10, "03.11");
  is(unicodeToNative("a👍b🏳️‍🌈c", "4"), "10", "03.12");
});

// other
// -----------------------------------------------------------------------------

test("04 - single astral symbol", () => {
  is(unicodeToNative("\uD834\uDF06", 0), 0, "04.01");
  throws(() => unicodeToNative("\uD834\uDF06", 1), /THROW_ID_02/, "04.02");
});

test("05 - multiple consecutive astral symbols", () => {
  is(unicodeToNative("\uD834\uDF06\uD834\uDF06", 0), 0, "05.01");
  is(unicodeToNative("\uD834\uDF06\uD834\uDF06", 1), 2, "05.02");

  is(unicodeToNative("\uD834\uDF06\uD834\uDF06", "0"), "0", "05.03");
  is(unicodeToNative("\uD834\uDF06\uD834\uDF06", "1"), "2", "05.04");
});

test("06 - two astral characters offsetting the rest", () => {
  equal(unicodeToNative("\uD834\uDF06aa", [0, 1, 2]), [0, 2, 3], "06.01");
});

test("07 - two astral characters offsetting the rest", () => {
  equal(
    unicodeToNative("\uD834\uDF06aa", ["0", "1", "2"]),
    ["0", "2", "3"],
    "07.01",
  );
});

test("08 - two astral characters offsetting the rest", () => {
  equal(unicodeToNative("\uD834\uDF06aa", [1, 0, 2]), [2, 0, 3], "08.01");
});

test("09 - two astral characters offsetting the rest", () => {
  equal(
    unicodeToNative("\uD834\uDF06aa", ["1", "0", "2"]),
    ["2", "0", "3"],
    "09.01",
  );
});

test("10 - two astral characters offsetting the rest", () => {
  equal(unicodeToNative("\uD834\uDF06aa", ["2", "0"]), ["3", "0"], "10.01");
});

test("11 - two astral characters offsetting the rest", () => {
  throws(
    () => unicodeToNative("\uD834\uDF06aa", [1, 0, 2, 3, 4]),
    /THROW_ID_02/,
    "11.01",
  );
});

test("12 - two astral characters offsetting the rest", () => {
  throws(
    () => unicodeToNative("\uD834\uDF06aa", ["1", "0", "2", "3", "4"]),
    /THROW_ID_02/,
    "12.01",
  );
});

test("13 - modern emoji ZWJ sequence", () => {
  equal(unicodeToNative("a🧑‍🤝‍🧑b", [0, 1, 2]), [0, 1, 9], "13.01");
});

test.run();
