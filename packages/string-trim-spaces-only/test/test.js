import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { trimSpaces as trim } from "../dist/string-trim-spaces-only.esm.js";

const rawnbsp = "\u00a0";

test("01 - empty string, defaults", () => {
  equal(
    trim(""),
    {
      res: "",
      ranges: [],
    },
    "01.01",
  );
});

test("02 - empty string, classicTrim=false", () => {
  equal(
    trim("", { classicTrim: false }),
    {
      res: "",
      ranges: [],
    },
    "02.01",
  );
});

test("03 - empty string, classicTrim=true", () => {
  equal(
    trim("", { classicTrim: true }),
    {
      res: "",
      ranges: [],
    },
    "03.01",
  );
});

test("04 - single space, defaults", () => {
  equal(
    trim(" "),
    {
      res: "",
      ranges: [[0, 1]],
    },
    "04.01",
  );
});

test("05 - single space, classicTrim=false", () => {
  equal(
    trim(" ", { classicTrim: false }),
    {
      res: "",
      ranges: [[0, 1]],
    },
    "05.01",
  );
});

test("06 - single space, classicTrim=true", () => {
  equal(
    trim(" ", { classicTrim: true }),
    {
      res: "",
      ranges: [[0, 1]],
    },
    "06.01",
  );
});

test("07 - single letter", () => {
  equal(trim("a"), { res: "a", ranges: [] }, "07.01");
});

test("08 - single letter, classicTrim=false", () => {
  equal(trim("a", { classicTrim: false }), { res: "a", ranges: [] }, "08.01");
});

test("09 - single letter, classicTrim=true", () => {
  equal(trim("a", { classicTrim: true }), { res: "a", ranges: [] }, "09.01");
});

test("10 - leading space, default", () => {
  equal(trim(" a a"), { res: "a a", ranges: [[0, 1]] }, "10.01");
});

test("11 - leading space, classicTrim=false", () => {
  equal(
    trim(" a a", { classicTrim: false }),
    { res: "a a", ranges: [[0, 1]] },
    "11.01",
  );
});

test("12 - leading space, classicTrim=true", () => {
  equal(
    trim(" a a", { classicTrim: true }),
    { res: "a a", ranges: [[0, 1]] },
    "12.01",
  );
});

test("13 - trailing space, defaults", () => {
  equal(trim("a a "), { res: "a a", ranges: [[3, 4]] }, "13.01");
});

test("14 - trailing space, defaults", () => {
  equal(
    trim("a a ", { classicTrim: false }),
    { res: "a a", ranges: [[3, 4]] },
    "14.01",
  );
});

test("15 - trailing space, defaults", () => {
  equal(
    trim("a a ", { classicTrim: true }),
    { res: "a a", ranges: [[3, 4]] },
    "15.01",
  );
});

test("16 - space on both sides", () => {
  equal(
    trim("   a a     "),
    {
      res: "a a",
      ranges: [
        [0, 3],
        [6, 11],
      ],
    },
    "16.01",
  );
});

test("17 - space on both sides - copes with emoji", () => {
  equal(
    trim("   👍     "),
    {
      res: "👍",
      ranges: [
        [0, 3],
        [5, 10],
      ],
    },
    "17.01",
  );
});

test("18 - space on both sides - classicTrim=true", () => {
  equal(
    trim("   a a     ", { classicTrim: true }),
    {
      res: "a a",
      ranges: [
        [0, 3],
        [6, 11],
      ],
    },
    "18.01",
  );
});

test("19 - space on both sides - copes with emoji - classicTrim=true", () => {
  equal(
    trim("   👍     ", { classicTrim: true }),
    {
      res: "👍",
      ranges: [
        [0, 3],
        [5, 10],
      ],
    },
    "19.01",
  );
});

test("20 - trimming hits the newline and stops", () => {
  equal(
    trim("   \n  a a  \n   "),
    {
      res: "\n  a a  \n",
      ranges: [
        [0, 3],
        [12, 15],
      ],
    },
    "20.01",
  );
});

test("21 - trimming hits the tab and stops", () => {
  equal(
    trim("   \t  a a  \t   "),
    {
      res: "\t  a a  \t",
      ranges: [
        [0, 3],
        [12, 15],
      ],
    },
    "21.01",
  );
});

test("22 - trimming hits the newline and stops - classicTrim", () => {
  equal(
    trim("   \n  a a  \n   ", { classicTrim: true }),
    {
      res: "a a",
      ranges: [
        [0, 6],
        [9, 15],
      ],
    }, // <---------------- !
    "22.01",
  );
});

test("23 - trimming hits the tab and stops - classicTrim", () => {
  equal(
    trim("   \t  a a  \t   ", { classicTrim: true }),
    {
      res: "a a",
      ranges: [
        [0, 6],
        [9, 15],
      ],
    }, // <---------------- !
    "23.01",
  );
});

test("24 - non-string input", () => {
  throws(
    () => {
      trim(true);
    },
    /THROW_ID_01/g,
    "24.01",
  );

  throws(
    () => {
      trim(undefined);
    },
    /THROW_ID_01/g,
    "24.02",
  );

  throws(
    () => {
      trim(9);
    },
    /THROW_ID_01/g,
    "24.03",
  );

  let input = { a: "zzz" };
  throws(
    () => {
      trim(input);
    },
    /THROW_ID_01/g,
    "24.04",
  );

  throws(
    () => {
      trim(true, { classicTrim: true });
    },
    /THROW_ID_01/g,
    "24.05",
  );

  throws(
    () => {
      trim(undefined, { classicTrim: true });
    },
    /THROW_ID_01/g,
    "24.06",
  );

  throws(
    () => {
      trim(9, { classicTrim: true });
    },
    /THROW_ID_01/g,
    "24.07",
  );

  throws(
    () => {
      trim(input, { classicTrim: true });
    },
    /THROW_ID_01/g,
    "24.08",
  );
});

// opts.space
test("25 - opts.space - default", () => {
  equal(
    trim("   a b c   "),
    {
      res: "a b c",
      ranges: [
        [0, 3],
        [8, 11],
      ],
    },
    "25.01",
  );
});

test("26 - opts.space - tabs", () => {
  equal(
    trim(" \t  a b c  \t "),
    {
      res: "\t  a b c  \t",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "26.01",
  );
  equal(
    trim(" \t  a b c  \t ", { space: true }),
    {
      res: "\t  a b c  \t",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "26.02",
  );
  equal(
    trim(" \t  a b c  \t ", { tab: true, classicTrim: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "26.03",
  );
  equal(
    trim(" \t  a b c  \t ", { space: true, tab: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "26.04",
  );
  equal(
    trim(" \t  a b c  \t ", { space: false, tab: true }),
    { res: " \t  a b c  \t ", ranges: [] },
    "26.05",
  );
});

// opts.cr
test("27 - opts.cr", () => {
  equal(
    trim(" \t  a b c  \t "),
    {
      res: "\t  a b c  \t",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "27.01",
  );
  equal(
    trim(" \t  a b c  \t ", { cr: true }),
    {
      res: "\t  a b c  \t",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "27.02",
  );
  equal(
    trim(" \t  a b c  \t ", { cr: true, classicTrim: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "27.03",
  );
  equal(
    trim(" \r  a b c  \r ", { cr: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "27.04",
  );
  equal(
    trim(" \r  a b c  \r ", { cr: true, space: false }),
    { res: " \r  a b c  \r ", ranges: [] },
    "27.05",
  );
  equal(
    trim("\r  a b c  \r", { cr: true, space: false }),
    {
      res: "  a b c  ",
      ranges: [
        [0, 1],
        [10, 11],
      ],
    },
    "27.06",
  );
});

// opts.cr
test("28 - opts.lf", () => {
  equal(
    trim(" \t  a b c  \t "),
    {
      res: "\t  a b c  \t",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "28.01",
  );
  equal(
    trim(" \t  a b c  \t ", { lf: true }),
    {
      res: "\t  a b c  \t",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "28.02",
  );
  equal(
    trim(" \t  a b c  \t ", { lf: true, classicTrim: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "28.03",
  );
  equal(
    trim(" \n  a b c  \n ", { lf: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "28.04",
  );
  equal(
    trim(" \n  a b c  \n ", { lf: true, space: false }),
    { res: " \n  a b c  \n ", ranges: [] },
    "28.05",
  );
  equal(
    trim("\n  a b c  \n", { lf: true, space: false }),
    {
      res: "  a b c  ",
      ranges: [
        [0, 1],
        [10, 11],
      ],
    },
    "28.06",
  );
});

// opts.tab
test("29 - opts.tab", () => {
  equal(
    trim(" \n  a b c  \n "),
    {
      res: "\n  a b c  \n",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "29.01",
  );
  equal(
    trim(" \n  a b c  \n ", { tab: true }),
    {
      res: "\n  a b c  \n",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "29.02",
  );
  equal(
    trim(" \n  a b c  \n ", { tab: true, classicTrim: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "29.03",
  );
  equal(
    trim(" \t  a b c  \t ", { tab: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "29.04",
  );
  equal(
    trim(" \t  a b c  \t ", { tab: true, space: false }),
    { res: " \t  a b c  \t ", ranges: [] },
    "29.05",
  );
  equal(
    trim("\t  a b c  \t", { tab: true, space: false }),
    {
      res: "  a b c  ",
      ranges: [
        [0, 1],
        [10, 11],
      ],
    },
    "29.06",
  );
});

// opts.nbsp
test("30 - opts.nbsp", () => {
  equal(
    trim(" \n  a b c  \n "),
    {
      res: "\n  a b c  \n",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "30.01",
  );
  equal(
    trim(" \n  a b c  \n ", { nbsp: true }),
    {
      res: "\n  a b c  \n",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "30.02",
  );
  equal(
    trim(" \n  a b c  \n ", { nbsp: true, classicTrim: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "30.03",
  );
  equal(
    trim(` ${rawnbsp}  a b c  ${rawnbsp} `, { nbsp: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "30.04",
  );
  equal(
    trim(` ${rawnbsp}  a b c  ${rawnbsp} `, { nbsp: true, space: false }),
    { res: ` ${rawnbsp}  a b c  ${rawnbsp} `, ranges: [] },
    "30.05",
  );
  equal(
    trim(`${rawnbsp}  a b c  ${rawnbsp}`, { nbsp: true, space: false }),
    {
      res: "  a b c  ",
      ranges: [
        [0, 1],
        [10, 11],
      ],
    },
    "30.06",
  );
  equal(
    trim(`${rawnbsp}  a b c  ${rawnbsp}`, {
      nbsp: true,
      space: false,
      classicTrim: true,
    }),
    {
      res: "a b c",
      ranges: [
        [0, 3],
        [8, 11],
      ],
    },
    "30.07",
  );
});

test.run();
