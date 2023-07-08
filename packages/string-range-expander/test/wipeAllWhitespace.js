import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { expander as e } from "../dist/string-range-expander.esm.js";

// -----------------------------------------------------------------------------

test("01 - expanding in the middle of the word", () => {
  let str = "aaa  bbb  ccc";

  // defaults
  equal(
    e({
      str,
      from: 5, // instruction to delete "bbb"
      to: 8,
    }),
    [4, 9],
    "01.01",
  );

  // left
  equal(
    e({
      str,
      from: 5,
      to: 8,
      wipeAllWhitespaceOnLeft: false,
    }),
    [4, 9],
    "01.02",
  );
  equal(
    e({
      str,
      from: 5,
      to: 8,
      wipeAllWhitespaceOnLeft: true,
    }),
    [3, 9],
    "01.03",
  );

  // right
  equal(
    e({
      str,
      from: 5,
      to: 8,
      wipeAllWhitespaceOnRight: false,
    }),
    [4, 9],
    "01.04",
  );
  equal(
    e({
      str,
      from: 5,
      to: 8,
      wipeAllWhitespaceOnRight: true,
    }),
    [4, 10],
    "01.05",
  );

  // both
  equal(
    e({
      str,
      from: 5,
      to: 8,
      wipeAllWhitespaceOnLeft: true,
      wipeAllWhitespaceOnRight: true,
    }),
    [3, 10],
    "01.06",
  );
});

test("02 - expanding in the beginning of the word", () => {
  let str = "  aaa  bbb  ccc";

  // defaults
  equal(
    e({
      str,
      from: 2, // instruction to delete "aaa"
      to: 5,
    }),
    [1, 6],
    "02.01",
  );

  // left
  equal(
    e({
      str,
      from: 2,
      to: 5,
      wipeAllWhitespaceOnLeft: false,
    }),
    [1, 6],
    "02.02",
  );
  equal(
    e({
      str,
      from: 2,
      to: 5,
      wipeAllWhitespaceOnLeft: true,
    }),
    [0, 6],
    "02.03",
  );

  // right
  equal(
    e({
      str,
      from: 2,
      to: 5,
      wipeAllWhitespaceOnRight: false,
    }),
    [1, 6],
    "02.04",
  );
  equal(
    e({
      str,
      from: 2,
      to: 5,
      wipeAllWhitespaceOnRight: true,
    }),
    [1, 7],
    "02.05",
  );

  // both
  equal(
    e({
      str,
      from: 2,
      to: 5,
      wipeAllWhitespaceOnLeft: true,
      wipeAllWhitespaceOnRight: true,
    }),
    [0, 7],
    "02.06",
  );
});

test("03 - combo with opts.ifLeftSideIncludesThisCropItToo - end of the string further", () => {
  let str = "  ;  aaa  ;  ";
  equal(
    e({
      str,
      from: 5, // instruction to delete "aaa"
      to: 8,
    }),
    [4, 9],
    "03.01",
  );
  equal(
    e({
      str,
      from: 5,
      to: 8,
      ifLeftSideIncludesThisCropItToo: "",
    }),
    [4, 9],
    "03.02",
  );
  equal(
    e({
      str,
      from: 5,
      to: 8,
      ifLeftSideIncludesThisCropItToo: ";",
      wipeAllWhitespaceOnLeft: false,
    }),
    [1, 9],
    "03.03",
  );
  equal(
    e({
      str,
      from: 5,
      to: 8,
      ifLeftSideIncludesThisCropItToo: ";",
      wipeAllWhitespaceOnLeft: true,
    }),
    [0, 9],
    "03.04",
  );
});

test("04 - combo with opts.ifLeftSideIncludesThisCropItToo - letter further", () => {
  let str = "  x;  aaa  bbb";
  equal(
    e({
      str,
      from: 6, // instruction to delete "aaa"
      to: 9,
    }),
    [5, 10],
    "04.01",
  );
  equal(
    e({
      str,
      from: 6,
      to: 9,
      ifLeftSideIncludesThisCropItToo: "",
    }),
    [5, 10],
    "04.02",
  );
  equal(
    e({
      str,
      from: 6,
      to: 9,
      ifLeftSideIncludesThisCropItToo: ";",
      wipeAllWhitespaceOnLeft: false,
    }),
    [3, 10],
    "04.03",
  );
  equal(
    e({
      str,
      from: 6,
      to: 9,
      ifLeftSideIncludesThisCropItToo: ";",
      wipeAllWhitespaceOnLeft: true,
    }),
    [3, 10],
    "04.04",
  );
});

test("05 - combo with opts.ifLeftSideIncludesThisCropItToo - whitespace+letter further", () => {
  let str = "  x  ;  aaa  bbb";
  equal(
    e({
      str,
      from: 8, // instruction to delete "aaa"
      to: 11,
    }),
    [7, 12],
    "05.01",
  );
  equal(
    e({
      str,
      from: 8,
      to: 11,
      ifLeftSideIncludesThisCropItToo: "",
    }),
    [7, 12],
    "05.02",
  );
  equal(
    e({
      str,
      from: 8,
      to: 11,
      ifLeftSideIncludesThisCropItToo: ";",
      wipeAllWhitespaceOnLeft: false,
    }),
    [4, 12],
    "05.03",
  );
  equal(
    e({
      str,
      from: 8,
      to: 11,
      ifLeftSideIncludesThisCropItToo: ";",
      wipeAllWhitespaceOnLeft: true,
    }),
    [3, 12],
    "05.04",
  );
});

test("06 - combo with opts.ifRightSideIncludesThisCropItToo - end of the string further", () => {
  let str = "  ;  aaa  ;  ";
  equal(
    e({
      str,
      from: 5, // instruction to delete "aaa"
      to: 8,
    }),
    [4, 9],
    "06.01",
  );
  equal(
    e({
      str,
      from: 5,
      to: 8,
      ifRightSideIncludesThisCropItToo: "",
    }),
    [4, 9],
    "06.02",
  );
  equal(
    e({
      str,
      from: 5,
      to: 8,
      ifRightSideIncludesThisCropItToo: ";",
      wipeAllWhitespaceOnRight: false,
    }),
    [4, 12],
    "06.03",
  );
  equal(
    e({
      str,
      from: 5,
      to: 8,
      ifRightSideIncludesThisCropItToo: ";",
      wipeAllWhitespaceOnRight: true,
    }),
    [4, 13],
    "06.04",
  );
});

test("07 - combo with opts.ifRightSideIncludesThisCropItToo - letter further", () => {
  let str = "  ;  aaa  ;x ";
  equal(
    e({
      str,
      from: 5, // instruction to delete "aaa"
      to: 8,
    }),
    [4, 9],
    "07.01",
  );
  equal(
    e({
      str,
      from: 5,
      to: 8,
      ifRightSideIncludesThisCropItToo: "",
    }),
    [4, 9],
    "07.02",
  );
  equal(
    e({
      str,
      from: 5,
      to: 8,
      ifRightSideIncludesThisCropItToo: ";",
      wipeAllWhitespaceOnRight: false,
    }),
    [4, 11],
    "07.03",
  );
  equal(
    e({
      str,
      from: 5,
      to: 8,
      ifRightSideIncludesThisCropItToo: ";",
      wipeAllWhitespaceOnRight: true,
    }),
    [4, 11],
    "07.04",
  );
});

test("08 - combo with opts.ifRightSideIncludesThisCropItToo - whitespace+letter further", () => {
  let str = "  ;  aaa  ;  x ";
  equal(
    e({
      str,
      from: 5, // instruction to delete "aaa"
      to: 8,
    }),
    [4, 9],
    "08.01",
  );
  equal(
    e({
      str,
      from: 5,
      to: 8,
      ifRightSideIncludesThisCropItToo: "",
    }),
    [4, 9],
    "08.02",
  );
  equal(
    e({
      str,
      from: 5,
      to: 8,
      ifRightSideIncludesThisCropItToo: ";",
      wipeAllWhitespaceOnRight: false,
    }),
    [4, 12],
    "08.03",
  );
  equal(
    e({
      str,
      from: 5,
      to: 8,
      ifRightSideIncludesThisCropItToo: ";",
      wipeAllWhitespaceOnRight: true,
    }),
    [4, 13],
    "08.04",
  );
});

test.run();
