import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  // matchLeftIncl,
  matchRightIncl,
  // matchLeft,
  matchRight,
} from "../dist/string-match-left-right.esm.js";

// 13. Ad-hoc
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`, () => {
  equal(matchRight('<a class="something"> text', 19, ">"), ">", "01.01");
});

test(`02 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`, () => {
  equal(
    matchRight('<a class="something"> text', 19, ">", {
      cb: (char) => typeof char === "string" && char.trim() === "",
    }),
    ">",
    "02.01",
  );
});

test(`03 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`, () => {
  equal(
    matchRightIncl('<a class="something"> text', 20, "> t"),
    "> t",
    "03.01",
  );
});

test(`04 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`, () => {
  equal(matchRight('<a class="something"> text', 19, "> t"), "> t", "04.01");
});

test(`05 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`, () => {
  equal(
    matchRight("ab      cdef", 1, "cde", { trimBeforeMatching: true }),
    "cde",
    "05.01",
  );
});

test(`06 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`, () => {
  equal(
    matchRight('<a class="something"> text', 19, ">", {
      cb: (char) => char === " ",
    }),
    ">",
    "06.01",
  );
});

test(`07 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`, () => {
  equal(
    matchRight("ab      cdef", 1, "cde", {
      cb: (char) => char === "f",
      trimBeforeMatching: true,
    }),
    "cde",
    "07.01",
  );
});

test(`08 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`, () => {
  matchRight("ab      cdef", 1, "cd", {
    trimBeforeMatching: true,
    cb: (char, theRemainderOfTheString, index) => {
      equal(char, "e");
      equal(theRemainderOfTheString, "ef");
      equal(index, 10);
    },
  });
});

test(`09 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, set #02`, () => {
  equal(
    matchRight("a<!DOCTYPE html>b", 1, ["!--", "doctype", "xml", "cdata"], {
      i: true,
      trimCharsBeforeMatching: ["?", "!", "[", " ", "-"],
    }),
    "doctype",
    "09.01",
  );
});

test("10", () => {
  equal(
    matchRight(".a{padding:1px 2px 3px 4px !important}", 23, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 1,
    }),
    false,
    "10.01",
  );
  equal(
    matchRight(".a{padding:1px 2px 3px 4px !important}", 23, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 1,
    }),
    false,
    "10.02",
  );

  equal(
    matchRight(".a{padding:1px 2px 3px 4px !important}", 23, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "10.03",
  );
  equal(
    matchRight(".a{padding:1px 2px 3px 4px !important}", 23, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 2,
    }),
    false,
    "10.04",
  );
});

test("11", () => {
  equal(
    matchRight(".a{padding:1px 2px 3px 4px !important}", 24, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 0,
    }),
    false,
    "11.01",
  );
  equal(
    matchRight(".a{padding:1px 2px 3px 4px !important}", 24, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 0,
    }),
    false,
    "11.02",
  );

  equal(
    matchRight(".a{padding:1px 2px 3px 4px !important}", 24, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 1,
    }),
    false,
    "11.03",
  );
  equal(
    matchRight(".a{padding:1px 2px 3px 4px !important}", 24, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 1,
    }),
    false,
    "11.04",
  );

  equal(
    matchRight(".a{padding:1px 2px 3px 4px !important}", 24, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "11.05",
  );
  equal(
    matchRight(".a{padding:1px 2px 3px 4px !important}", 24, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 2,
    }),
    false,
    "11.06",
  );
});

test("12", () => {
  equal(
    matchRight(".a{padding:1px 2px 3px 4px !impotant}", 26, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 0,
    }),
    false,
    "12.01",
  );
  equal(
    matchRight(".a{padding:1px 2px 3px 4px !impotant}", 26, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 0,
    }),
    false,
    "12.02",
  );

  equal(
    matchRight(".a{padding:1px 2px 3px 4px !impotant}", 26, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 1,
    }),
    "!important",
    "12.03",
  );
  equal(
    matchRight(".a{padding:1px 2px 3px 4px !impotant}", 26, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 1,
    }),
    "!important",
    "12.04",
  );

  equal(
    matchRight(".a{padding:1px 2px 3px 4px !impotant}", 26, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    "!important",
    "12.05",
  );
  equal(
    matchRight(".a{padding:1px 2px 3px 4px !impotant}", 26, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 2,
    }),
    "!important",
    "12.06",
  );
});

test("13", () => {
  equal(
    matchRight(".a{padding:1px 2px 3px 4px !IMPOR.TANT}", 26, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 0,
    }),
    false,
    "13.01",
  );
  equal(
    matchRight(".a{padding:1px 2px 3px 4px !IMPOR.TANT}", 26, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 0,
    }),
    false,
    "13.02",
  );

  equal(
    matchRight(".a{padding:1px 2px 3px 4px !IMPOR.TANT}", 26, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 1,
    }),
    "!important",
    "13.03",
  );
  equal(
    matchRight(".a{padding:1px 2px 3px 4px !IMPOR.TANT}", 26, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 1,
    }),
    "!important",
    "13.04",
  );

  equal(
    matchRight(".a{padding:1px 2px 3px 4px !IMPOR.TANT}", 26, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    "!important",
    "13.05",
  );
  equal(
    matchRight(".a{padding:1px 2px 3px 4px !IMPOR.TANT}", 26, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 2,
    }),
    "!important",
    "13.06",
  );
});

test("14", () => {
  equal(
    matchRightIncl("<style>.a{color:red!IMPOTANT;}", 18, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 2,
    }),
    false,
    "14.01",
  );
  equal(
    matchRightIncl("<style>.a{color:red!IMPOTANT;}", 19, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 2,
    }),
    "!important",
    "14.02",
  );
  equal(
    matchRightIncl("<style>.a{color:red!IMPOTANT;}", 18, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "14.03",
  );
  equal(
    matchRightIncl("<style>.a{color:red!IMPOTANT;}", 19, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    "!important",
    "14.04",
  );

  equal(
    matchRightIncl("<style>.a{color:red!IMPOTANT;}", 18, ["!important"], {
      i: false,
      trimBeforeMatching: true,
      maxMismatches: 2,
    }),
    false,
    "14.05",
  );
  equal(
    matchRightIncl("<style>.a{color:red!IMPOTANT;}", 19, ["!important"], {
      i: false,
      trimBeforeMatching: true,
      maxMismatches: 2,
    }),
    false,
    "14.06",
  );
  equal(
    matchRightIncl("<style>.a{color:red!IMPOTANT;}", 18, ["!important"], {
      i: false,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "14.07",
  );
  equal(
    matchRightIncl("<style>.a{color:red!IMPOTANT;}", 19, ["!important"], {
      i: false,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "14.08",
  );
});

test("15", () => {
  equal(
    matchRightIncl("abc important}", 2, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 0,
    }),
    false,
    "15.01",
  );
  equal(
    matchRightIncl("abc important}", 2, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 1,
    }),
    false,
    "15.02",
  );
  equal(
    matchRightIncl("abc important}", 2, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 2,
    }),
    false,
    "15.03",
  );

  equal(
    matchRightIncl("abc important}", 2, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 0,
    }),
    false,
    "15.04",
  );
  equal(
    matchRightIncl("abc important}", 2, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 1,
    }),
    false,
    "15.05",
  );
  equal(
    matchRightIncl("abc important}", 2, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "15.06",
  );
});

test("16 - tight", () => {
  equal(
    matchRight("1px!important}", 0, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "16.01",
  );
  equal(
    matchRight("1px!important}", 1, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "16.02",
  );
  equal(
    matchRight("1px!important}", 2, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    "!important",
    "16.03",
  );
});

test("17 - tight", () => {
  equal(
    matchRight("1pximportant}", 0, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "17.01",
  );
  equal(
    matchRight("1pximportant}", 1, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "17.02",
  );
  equal(
    matchRight("1pximportant}", 2, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    "!important",
    "17.03",
  );
});

test("18 - tight", () => {
  equal(
    matchRightIncl("1pximportant}", 0, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "18.01",
  );
  equal(
    matchRightIncl("1pximportant}", 1, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "18.02",
  );
  equal(
    matchRightIncl("1pximportant}", 2, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "18.03",
  );
  equal(
    matchRightIncl("1pximportant}", 3, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    "!important",
    "18.04",
  );
});

test.run();
