import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { lineCol, getLineStartIndexes } from "../dist/line-column-mini.esm.js";

// -----------------------------------------------------------------------------
// group 01. peculiar inputs
// -----------------------------------------------------------------------------

test("01 - wrong/missing input = throw", () => {
  equal(lineCol(), null, "01.01");
  equal(lineCol(""), null, "01.02");
  equal(lineCol("", null), null, "01.03");
  equal(lineCol("a"), null, "01.04");
  equal(lineCol("a", null), null, "01.05");
  equal(lineCol("a", 1), null, "01.06");
  equal(lineCol("a", 99), null, "01.07");
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

test("02 - all possible line endings, no caching", () => {
  let input = "abc\ndef\r\nghi\rjkl";
  equal(
    lineCol(input, 0),
    {
      line: 1,
      col: 1,
    },
    "02.01 - a"
  );
  equal(
    lineCol(input, 1),
    {
      line: 1,
      col: 2,
    },
    "02.02 - b"
  );
  equal(
    lineCol(input, 2),
    {
      line: 1,
      col: 3,
    },
    "02.03 - c"
  );
  equal(
    lineCol(input, 3),
    {
      line: 1,
      col: 4,
    },
    "02.04 - \\n"
  );
  equal(
    lineCol(input, 4),
    {
      line: 2,
      col: 1,
    },
    "02.05 - d"
  );
  equal(
    lineCol(input, 5),
    {
      line: 2,
      col: 2,
    },
    "02.06 - e"
  );
  equal(
    lineCol(input, 6),
    {
      line: 2,
      col: 3,
    },
    "02.07 - f"
  );
  equal(
    lineCol(input, 7),
    {
      line: 2,
      col: 4,
    },
    "02.08 - \\r"
  );
  equal(
    lineCol(input, 8),
    {
      line: 2,
      col: 5,
    },
    "02.09 - \\n"
  );
  equal(
    lineCol(input, 9),
    {
      line: 3,
      col: 1,
    },
    "02.10 - g"
  );
  equal(
    lineCol(input, 10),
    {
      line: 3,
      col: 2,
    },
    "02.11 - h"
  );
  equal(
    lineCol(input, 11),
    {
      line: 3,
      col: 3,
    },
    "02.12 - i"
  );
  equal(
    lineCol(input, 12),
    {
      line: 3,
      col: 4,
    },
    "02.13 - \\r"
  );
  equal(
    lineCol(input, 13),
    {
      line: 4,
      col: 1,
    },
    "02.14 - j"
  );
  equal(
    lineCol(input, 14),
    {
      line: 4,
      col: 2,
    },
    "02.15 - k"
  );
  equal(
    lineCol(input, 15),
    {
      line: 4,
      col: 3,
    },
    "02.16 - l"
  );
  equal(lineCol(input, 16), null, "02.17 - on str.length");
});

test("03 - all possible line endings, with caching", () => {
  let input = "abc\ndef\r\nghi\rjkl";
  let startIndexes = getLineStartIndexes(input);
  equal(startIndexes, [0, 4, 9, 13, 17], "03.01");
  equal(
    lineCol(startIndexes, 0),
    {
      line: 1,
      col: 1,
    },
    "03.02 - a"
  );
  equal(
    lineCol(startIndexes, 1),
    {
      line: 1,
      col: 2,
    },
    "03.03 - b"
  );
  equal(
    lineCol(startIndexes, 2),
    {
      line: 1,
      col: 3,
    },
    "03.04 - c"
  );
  equal(
    lineCol(startIndexes, 3),
    {
      line: 1,
      col: 4,
    },
    "03.05 - \\n"
  );
  equal(
    lineCol(startIndexes, 4),
    {
      line: 2,
      col: 1,
    },
    "03.06 - d"
  );
  equal(
    lineCol(startIndexes, 5),
    {
      line: 2,
      col: 2,
    },
    "03.07 - e"
  );
  equal(
    lineCol(startIndexes, 6),
    {
      line: 2,
      col: 3,
    },
    "03.08 - f"
  );
  equal(
    lineCol(startIndexes, 7),
    {
      line: 2,
      col: 4,
    },
    "03.09 - \\r"
  );
  equal(
    lineCol(startIndexes, 8),
    {
      line: 2,
      col: 5,
    },
    "03.10 - \\n"
  );
  equal(
    lineCol(startIndexes, 9),
    {
      line: 3,
      col: 1,
    },
    "03.11 - g"
  );
  equal(
    lineCol(startIndexes, 10),
    {
      line: 3,
      col: 2,
    },
    "03.12 - h"
  );
  equal(
    lineCol(startIndexes, 11),
    {
      line: 3,
      col: 3,
    },
    "03.13 - i"
  );
  equal(
    lineCol(startIndexes, 12),
    {
      line: 3,
      col: 4,
    },
    "03.14 - \\r"
  );
  equal(
    lineCol(startIndexes, 13),
    {
      line: 4,
      col: 1,
    },
    "03.15 - j"
  );
  equal(
    lineCol(startIndexes, 14),
    {
      line: 4,
      col: 2,
    },
    "03.16 - k"
  );
  equal(
    lineCol(startIndexes, 15),
    {
      line: 4,
      col: 3,
    },
    "03.17 - l"
  );
  equal(lineCol(startIndexes, 16), null, "03.18 - on str.length");
});

test("04 - skipChecks arg", () => {
  let input = "abc\ndef\r\nghi\rjkl";
  // without caching
  equal(
    lineCol(input, 5, true),
    {
      line: 2,
      col: 2,
    },
    "04.01 - e"
  );

  // with caching
  let startIndexes = getLineStartIndexes(input);
  equal(
    lineCol(startIndexes, 5, true),
    {
      line: 2,
      col: 2,
    },
    "04.02 - e"
  );
});

test.run();
