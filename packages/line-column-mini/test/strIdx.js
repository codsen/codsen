import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { strIdx } from "../dist/line-column-mini.esm.js";

test("01 - all possible line endings, no caching", () => {
  let input = "abc\ndef\r\nghi\rjkl";
  // first row, "abc"
  equal(strIdx(input, 1, 1), 0, "01.01"); // a
  equal(strIdx(input, 1, 2), 1, "01.02"); // b
  equal(strIdx(input, 1, 3), 2, "01.03"); // c
  equal(strIdx(input, 1, 4), 3, "01.04"); // \n

  // the fifth would be beyond the first line's "\n" so give null
  equal(strIdx(input, 1, 5), null, "01.05");

  // second row, "def"
  equal(strIdx(input, 2, 1), 4, "01.06"); // d
  equal(strIdx(input, 2, 2), 5, "01.07"); // e
  equal(strIdx(input, 2, 3), 6, "01.08"); // f
  equal(strIdx(input, 2, 4), 7, "01.09"); // \r
  equal(strIdx(input, 2, 5), 8, "01.10"); // \n

  equal(strIdx(input, 2, 6), null, "01.11"); // went over

  equal(strIdx(input, 3, 1), 9, "01.12"); // g
  equal(strIdx(input, 3, 2), 10, "01.13"); // h
  equal(strIdx(input, 3, 3), 11, "01.14"); // i
  equal(strIdx(input, 3, 4), 12, "01.15"); // \r

  equal(strIdx(input, 3, 5), null, "01.16"); // went over

  equal(strIdx(input, 4, 1), 13, "01.17"); // j
  equal(strIdx(input, 4, 2), 14, "01.18"); // k
  equal(strIdx(input, 4, 3), 15, "01.19"); // l

  equal(strIdx(input, 4, 4), null, "01.20"); // beyond the string limit

  equal(strIdx(input, 5, 1), null, "01.21"); // beyond the string limit
});

test("02 - exceeding single line", () => {
  let input = "abcdef";
  //           123456
  equal(strIdx(input, 1, 6), 5, "02.01"); // f, column 6
  equal(strIdx(input, 1, 7), null, "02.02"); // does not exist
  equal(strIdx(input, 1, 99), null, "02.03");
});

test("03 - wrong/missing input => gives null, does not throw", () => {
  equal(strIdx(), null, "03.01");
  equal(strIdx(1), null, "03.02");
  equal(strIdx(""), null, "03.03");
  equal(strIdx("", null), null, "03.04");
  equal(strIdx("", null, null), null, "03.05");
  equal(strIdx("a"), null, "03.06");
  equal(strIdx("a", null), null, "03.07");
  equal(strIdx("a", null, null), null, "03.08");
  equal(strIdx("a", 0), null, "03.09"); // column "zero" does not exist
  equal(strIdx("a", 1), null, "03.10");
  equal(strIdx("a", 1, 2), null, "03.11");
  equal(strIdx("a", 99), null, "03.12");
  equal(strIdx("a", 99, 99), null, "03.13");
});

test.run();
