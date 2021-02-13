import tap from "tap";
import { lineCol, getLineStartIndexes } from "../dist/line-column-mini.esm";

// -----------------------------------------------------------------------------
// group 01. peculiar inputs
// -----------------------------------------------------------------------------

tap.test("01 - wrong/missing input = throw", (t) => {
  t.strictSame(lineCol(), null, "01.01");
  t.strictSame(lineCol(""), null, "01.02");
  t.strictSame(lineCol("", null), null, "01.03");
  t.strictSame(lineCol("a"), null, "01.04");
  t.strictSame(lineCol("a", null), null, "01.05");
  t.strictSame(lineCol("a", 1), null, "01.06");
  t.strictSame(lineCol("a", 99), null, "01.07");

  t.end();
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

tap.test("02 - all possible line endings, no caching", (t) => {
  const input = "abc\ndef\r\nghi\rjkl";
  t.strictSame(
    lineCol(input, 0),
    {
      line: 1,
      col: 1,
    },
    "02.01 - a"
  );
  t.strictSame(
    lineCol(input, 1),
    {
      line: 1,
      col: 2,
    },
    "02.02 - b"
  );
  t.strictSame(
    lineCol(input, 2),
    {
      line: 1,
      col: 3,
    },
    "02.03 - c"
  );
  t.strictSame(
    lineCol(input, 3),
    {
      line: 1,
      col: 4,
    },
    "02.04 - \\n"
  );
  t.strictSame(
    lineCol(input, 4),
    {
      line: 2,
      col: 1,
    },
    "02.05 - d"
  );
  t.strictSame(
    lineCol(input, 5),
    {
      line: 2,
      col: 2,
    },
    "02.06 - e"
  );
  t.strictSame(
    lineCol(input, 6),
    {
      line: 2,
      col: 3,
    },
    "02.07 - f"
  );
  t.strictSame(
    lineCol(input, 7),
    {
      line: 2,
      col: 4,
    },
    "02.08 - \\r"
  );
  t.strictSame(
    lineCol(input, 8),
    {
      line: 2,
      col: 5,
    },
    "02.09 - \\n"
  );
  t.strictSame(
    lineCol(input, 9),
    {
      line: 3,
      col: 1,
    },
    "02.10 - g"
  );
  t.strictSame(
    lineCol(input, 10),
    {
      line: 3,
      col: 2,
    },
    "02.11 - h"
  );
  t.strictSame(
    lineCol(input, 11),
    {
      line: 3,
      col: 3,
    },
    "02.12 - i"
  );
  t.strictSame(
    lineCol(input, 12),
    {
      line: 3,
      col: 4,
    },
    "02.13 - \\r"
  );
  t.strictSame(
    lineCol(input, 13),
    {
      line: 4,
      col: 1,
    },
    "02.14 - j"
  );
  t.strictSame(
    lineCol(input, 14),
    {
      line: 4,
      col: 2,
    },
    "02.15 - k"
  );
  t.strictSame(
    lineCol(input, 15),
    {
      line: 4,
      col: 3,
    },
    "02.16 - l"
  );
  t.strictSame(lineCol(input, 16), null, "02.17 - on str.length");

  t.end();
});

tap.test("03 - all possible line endings, with caching", (t) => {
  const input = "abc\ndef\r\nghi\rjkl";
  const startIndexes = getLineStartIndexes(input);
  t.strictSame(startIndexes, [0, 4, 9, 13, 17], "03.01");
  t.strictSame(
    lineCol(startIndexes, 0),
    {
      line: 1,
      col: 1,
    },
    "03.02 - a"
  );
  t.strictSame(
    lineCol(startIndexes, 1),
    {
      line: 1,
      col: 2,
    },
    "03.03 - b"
  );
  t.strictSame(
    lineCol(startIndexes, 2),
    {
      line: 1,
      col: 3,
    },
    "03.04 - c"
  );
  t.strictSame(
    lineCol(startIndexes, 3),
    {
      line: 1,
      col: 4,
    },
    "03.05 - \\n"
  );
  t.strictSame(
    lineCol(startIndexes, 4),
    {
      line: 2,
      col: 1,
    },
    "03.06 - d"
  );
  t.strictSame(
    lineCol(startIndexes, 5),
    {
      line: 2,
      col: 2,
    },
    "03.07 - e"
  );
  t.strictSame(
    lineCol(startIndexes, 6),
    {
      line: 2,
      col: 3,
    },
    "03.08 - f"
  );
  t.strictSame(
    lineCol(startIndexes, 7),
    {
      line: 2,
      col: 4,
    },
    "03.09 - \\r"
  );
  t.strictSame(
    lineCol(startIndexes, 8),
    {
      line: 2,
      col: 5,
    },
    "03.10 - \\n"
  );
  t.strictSame(
    lineCol(startIndexes, 9),
    {
      line: 3,
      col: 1,
    },
    "03.11 - g"
  );
  t.strictSame(
    lineCol(startIndexes, 10),
    {
      line: 3,
      col: 2,
    },
    "03.12 - h"
  );
  t.strictSame(
    lineCol(startIndexes, 11),
    {
      line: 3,
      col: 3,
    },
    "03.13 - i"
  );
  t.strictSame(
    lineCol(startIndexes, 12),
    {
      line: 3,
      col: 4,
    },
    "03.14 - \\r"
  );
  t.strictSame(
    lineCol(startIndexes, 13),
    {
      line: 4,
      col: 1,
    },
    "03.15 - j"
  );
  t.strictSame(
    lineCol(startIndexes, 14),
    {
      line: 4,
      col: 2,
    },
    "03.16 - k"
  );
  t.strictSame(
    lineCol(startIndexes, 15),
    {
      line: 4,
      col: 3,
    },
    "03.17 - l"
  );
  t.strictSame(lineCol(startIndexes, 16), null, "03.18 - on str.length");

  t.end();
});

tap.test("04 - skipChecks arg", (t) => {
  const input = "abc\ndef\r\nghi\rjkl";
  // without caching
  t.strictSame(
    lineCol(input, 5, true),
    {
      line: 2,
      col: 2,
    },
    "04.01 - e"
  );

  // with caching
  const startIndexes = getLineStartIndexes(input);
  t.strictSame(
    lineCol(startIndexes, 5, true),
    {
      line: 2,
      col: 2,
    },
    "04.02 - e"
  );
  t.end();
});
