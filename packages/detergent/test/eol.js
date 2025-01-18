import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { det as realDet } from "../dist/detergent.esm.js";
import { det } from "../t-util/util.js";

test(`01 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - HTML BR replacement with XHTML BR`, () => {
  compare(
    ok,
    det(ok, not, 0, "a\nb", {
      removeLineBreaks: false,
      replaceLineBreaks: false,
    }),
    {
      res: "a\nb",
      applicableOpts: {
        fixBrokenEntities: false,
        removeWidows: false,
        convertEntities: false,
        convertDashes: false,
        convertApostrophes: false,
        replaceLineBreaks: true,
        removeLineBreaks: true,
        useXHTML: false,
        dontEncodeNonLatin: false,
        addMissingSpaces: false,
        convertDotsToEllipsis: false,
        stripHtml: false,
        eol: true,
      },
    },
    "01",
  );
});

//                            1x3
// ------------------------------------------------------------

test("02 - trailing line break, homogeneous, no explicit setting - all CRLF", () => {
  equal(
    realDet("a\r\nb\r\n", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
    }).res,
    "a\r\nb",
    "02.01",
  );
});

test("03 - trailing line break, homogeneous, no explicit setting - all CR", () => {
  equal(
    realDet("a\rb\r", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
    }).res,
    "a\rb",
    "03.01",
  );
});

test("04 - trailing line break, homogeneous, no explicit setting - all LF", () => {
  equal(
    realDet("a\nb\n", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
    }).res,
    "a\nb",
    "04.01",
  );
});

//                            1x3
// ------------------------------------------------------------

test("05 - trailing line break, homogeneous, explicit LF setting - all CRLF", () => {
  equal(
    det(ok, not, 0, "a\r\nb\r\n", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "lf",
    }).res,
    "a\nb",
    "05.01",
  );
});

test("06 - trailing line break, homogeneous, explicit LF setting - all CR", () => {
  equal(
    det(ok, not, 0, "a\rb\r", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "lf",
    }).res,
    "a\nb",
    "06.01",
  );
});

test("07 - trailing line break, homogeneous, explicit LF setting - all LF", () => {
  equal(
    det(ok, not, 0, "a\nb\n", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "lf",
    }).res,
    "a\nb",
    "07.01",
  );
});

//                            1x3
// ------------------------------------------------------------

test("08 - trailing line break, homogeneous, explicit CRLF setting - CRLF in the input", () => {
  equal(
    det(ok, not, 0, "a\r\nb\r\n", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "crlf",
    }).res,
    "a\r\nb",
    "08.01",
  );
});

test("09 - trailing line break, homogeneous, explicit CRLF setting - CR in the input", () => {
  equal(
    realDet("a\rb\r", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "crlf",
    }).res,
    "a\r\nb",
    "09.01",
  );
  equal(
    det(ok, not, 0, "a\rb\r", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "crlf",
    }).res,
    "a\r\nb",
    "09.02",
  );
});

test("10 - trailing line break, homogeneous, explicit CRLF setting - LF in the input", () => {
  equal(
    realDet("a\nb\n", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "crlf",
    }).res,
    "a\r\nb",
    "10.01",
  );
  equal(
    det(ok, not, 0, "a\nb\n", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "crlf",
    }).res,
    "a\r\nb",
    "10.02",
  );
});

//                            1x3
// ------------------------------------------------------------

test("11 - trailing line break, homogeneous, explicit CR setting - CRLF input", () => {
  equal(
    det(ok, not, 0, "a\r\nb\r\n", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "cr",
    }).res,
    "a\rb",
    "11.01",
  );
});

test("12 - trailing line break, homogeneous, explicit CR setting - CR input", () => {
  equal(
    det(ok, not, 0, "a\rb\r", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "cr",
    }).res,
    "a\rb",
    "12.01",
  );
});

test("13 - trailing line break, homogeneous, explicit CR setting - LF input", () => {
  equal(
    det(ok, not, 0, "a\nb\n", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "cr",
    }).res,
    "a\rb",
    "13.01",
  );
});

//                            1x3
// ------------------------------------------------------------

test("14 - non-homogeneous, #1 - LF setting", () => {
  let input = "\na\rb\r\nc\r";
  equal(
    det(ok, not, 0, input, {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "lf",
    }).res,
    "a\nb\nc",
    "14.01",
  );
  equal(
    det(ok, not, 0, input, {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "cr",
    }).res,
    "a\rb\rc",
    "14.02",
  );
  equal(
    det(ok, not, 0, input, {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "crlf",
    }).res,
    "a\r\nb\r\nc",
    "14.03",
  );
});

//                            1x3
// ------------------------------------------------------------

test("15 - non-homogeneous, #2 - no trailing line break", () => {
  let input = "\na\rb\r\nc";
  equal(
    det(ok, not, 0, input, {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "lf",
    }).res,
    "a\nb\nc",
    "15.01",
  );
  equal(
    det(ok, not, 0, input, {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "cr",
    }).res,
    "a\rb\rc",
    "15.02",
  );
  equal(
    det(ok, not, 0, input, {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "crlf",
    }).res,
    "a\r\nb\r\nc",
    "15.03",
  );
});

// ------------------------------------------------------------

test.run();
