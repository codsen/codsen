import tap from "tap";
import { unicodeToNative } from "../dist/string-convert-indexes.esm";

// single-length characters only:
// -----------------------------------------------------------------------------

tap.test("01 - one letter string", (t) => {
  t.is(unicodeToNative("a", 0), 0, "01.01");
  t.is(unicodeToNative("a", "0"), "0", "01.02");
  t.end();
});

tap.test("02 - non-emoji indexes match completely", (t) => {
  const source = `  \n\n\r \t\t\t\t \r\r sljg dflgfhkf23647834563iuerhgkdjgxkf \n \r      \r sljl djflkgjd \r slfslj \n\n\n\n\n\n\n....`;
  source.split("").forEach((char, idx) => {
    t.is(unicodeToNative(source, idx), idx, `02/${idx}`);
  });
  t.end();
});

// multiple-length characters
// -----------------------------------------------------------------------------

tap.test("03 - one letter string", (t) => {
  // 2-long emojis
  t.is(unicodeToNative("👍", 0), 0, "03.01");
  t.is(unicodeToNative("👍👍", 0), 0, "03.02");
  t.is(unicodeToNative("👍👍", 1), 2, "03.03");
  t.is(unicodeToNative("👍👍", 1), 2, "03.04");

  // 6-long emojis
  t.is(unicodeToNative("🏳️‍🌈🏳️‍🌈", 0), 0, "03.05");
  t.is(unicodeToNative("🏳️‍🌈🏳️‍🌈", 1), 6, "03.06");

  // mix
  t.is(unicodeToNative("a👍b🏳️‍🌈c", 0), 0, "03.07");
  t.is(unicodeToNative("a👍b🏳️‍🌈c", 1), 1, "03.08");
  t.is(unicodeToNative("a👍b🏳️‍🌈c", 2), 3, "03.09");
  t.is(unicodeToNative("a👍b🏳️‍🌈c", 3), 4, "03.10");
  t.is(unicodeToNative("a👍b🏳️‍🌈c", 4), 10, "03.11");
  t.is(unicodeToNative("a👍b🏳️‍🌈c", "4"), "10", "03.12");
  t.end();
});

// other
// -----------------------------------------------------------------------------

tap.test("04 - single astral symbol", (t) => {
  t.is(unicodeToNative("\uD834\uDF06", 0), 0, "04.01");
  t.throws(() => unicodeToNative("\uD834\uDF06", 1), /THROW_ID_06/, "04.02");
  t.end();
});

tap.test("05 - multiple consecutive astral symbols", (t) => {
  t.is(unicodeToNative("\uD834\uDF06\uD834\uDF06", 0), 0, "05.01");
  t.is(unicodeToNative("\uD834\uDF06\uD834\uDF06", 1), 2, "05.02");

  t.is(unicodeToNative("\uD834\uDF06\uD834\uDF06", "0"), "0", "05.03");
  t.is(unicodeToNative("\uD834\uDF06\uD834\uDF06", "1"), "2", "05.04");
  t.end();
});

tap.test("06 - two astral characters offsetting the rest", (t) => {
  t.strictSame(
    unicodeToNative("\uD834\uDF06aa", [0, 1, 2]),
    [0, 2, 3],
    "06 - all unique, sorted"
  );
  t.end();
});

tap.test("07 - two astral characters offsetting the rest", (t) => {
  t.strictSame(
    unicodeToNative("\uD834\uDF06aa", ["0", "1", "2"]),
    ["0", "2", "3"],
    "07"
  );
  t.end();
});

tap.test("08 - two astral characters offsetting the rest", (t) => {
  t.strictSame(
    unicodeToNative("\uD834\uDF06aa", [1, 0, 2]),
    [2, 0, 3],
    "08 - all unique, mixed up"
  );
  t.end();
});

tap.test("09 - two astral characters offsetting the rest", (t) => {
  t.strictSame(
    unicodeToNative("\uD834\uDF06aa", ["1", "0", "2"]),
    ["2", "0", "3"],
    "09"
  );
  t.end();
});

tap.test("10 - two astral characters offsetting the rest", (t) => {
  t.strictSame(unicodeToNative("\uD834\uDF06aa", ["2", "0"]), ["3", "0"], "10");
  t.end();
});

tap.test("11 - two astral characters offsetting the rest", (t) => {
  t.throws(
    () => unicodeToNative("\uD834\uDF06aa", [1, 0, 2, 3, 4]),
    /THROW_ID_06/,
    "11"
  );
  t.end();
});

tap.test("12 - two astral characters offsetting the rest", (t) => {
  t.throws(
    () => unicodeToNative("\uD834\uDF06aa", ["1", "0", "2", "3", "4"]),
    /THROW_ID_06/,
    "12"
  );
  t.end();
});
