// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { det as realDet } from "../dist/detergent.esm.js";
import { det } from "../t-util/util.js";

test("001 - line breaks - HTML BR replacement with XHTML BR", () => {
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

test("002 - trailing line break, homogeneous, no explicit setting - all CRLF", () => {
  equal(
    realDet("a\r\nb\r\n", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
    }).res,
    "a\r\nb",
    "002.01",
  );
});

test("003 - trailing line break, homogeneous, no explicit setting - all CR", () => {
  equal(
    realDet("a\rb\r", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
    }).res,
    "a\rb",
    "003.01",
  );
});

test("004 - trailing line break, homogeneous, no explicit setting - all LF", () => {
  equal(
    realDet("a\nb\n", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
    }).res,
    "a\nb",
    "004.01",
  );
});

//                            1x3
// ------------------------------------------------------------

test("005 - trailing line break, homogeneous, explicit LF setting - all CRLF", () => {
  equal(
    det(ok, not, 0, "a\r\nb\r\n", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "lf",
    }).res,
    "a\nb",
    "005.01",
  );
});

test("006 - trailing line break, homogeneous, explicit LF setting - all CR", () => {
  equal(
    det(ok, not, 0, "a\rb\r", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "lf",
    }).res,
    "a\nb",
    "006.01",
  );
});

test("007 - trailing line break, homogeneous, explicit LF setting - all LF", () => {
  equal(
    det(ok, not, 0, "a\nb\n", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "lf",
    }).res,
    "a\nb",
    "007.01",
  );
});

//                            1x3
// ------------------------------------------------------------

test("008 - trailing line break, homogeneous, explicit CRLF setting - CRLF in the input", () => {
  equal(
    det(ok, not, 0, "a\r\nb\r\n", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "crlf",
    }).res,
    "a\r\nb",
    "008.01",
  );
});

test("009 - trailing line break, homogeneous, explicit CRLF setting - CR in the input", () => {
  equal(
    realDet("a\rb\r", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "crlf",
    }).res,
    "a\r\nb",
    "009.01",
  );
  equal(
    det(ok, not, 0, "a\rb\r", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "crlf",
    }).res,
    "a\r\nb",
    "009.02",
  );
});

test("010 - trailing line break, homogeneous, explicit CRLF setting - LF in the input", () => {
  equal(
    realDet("a\nb\n", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "crlf",
    }).res,
    "a\r\nb",
    "010.01",
  );
  equal(
    det(ok, not, 0, "a\nb\n", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "crlf",
    }).res,
    "a\r\nb",
    "010.02",
  );
});

//                            1x3
// ------------------------------------------------------------

test("011 - trailing line break, homogeneous, explicit CR setting - CRLF input", () => {
  equal(
    det(ok, not, 0, "a\r\nb\r\n", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "cr",
    }).res,
    "a\rb",
    "011.01",
  );
});

test("012 - trailing line break, homogeneous, explicit CR setting - CR input", () => {
  equal(
    det(ok, not, 0, "a\rb\r", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "cr",
    }).res,
    "a\rb",
    "012.01",
  );
});

test("013 - trailing line break, homogeneous, explicit CR setting - LF input", () => {
  equal(
    det(ok, not, 0, "a\nb\n", {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "cr",
    }).res,
    "a\rb",
    "013.01",
  );
});

//                            1x3
// ------------------------------------------------------------

test("014 - non-homogeneous, #1 - LF setting", () => {
  let input = "\na\rb\r\nc\r";
  equal(
    det(ok, not, 0, input, {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "lf",
    }).res,
    "a\nb\nc",
    "014.01",
  );
  equal(
    det(ok, not, 0, input, {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "cr",
    }).res,
    "a\rb\rc",
    "014.02",
  );
  equal(
    det(ok, not, 0, input, {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "crlf",
    }).res,
    "a\r\nb\r\nc",
    "014.03",
  );
});

//                            1x3
// ------------------------------------------------------------

test("015 - non-homogeneous, #2 - no trailing line break", () => {
  let input = "\na\rb\r\nc";
  equal(
    det(ok, not, 0, input, {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "lf",
    }).res,
    "a\nb\nc",
    "015.01",
  );
  equal(
    det(ok, not, 0, input, {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "cr",
    }).res,
    "a\rb\rc",
    "015.02",
  );
  equal(
    det(ok, not, 0, input, {
      replaceLineBreaks: false,
      removeLineBreaks: false,
      eol: "crlf",
    }).res,
    "a\r\nb\r\nc",
    "015.03",
  );
});

// ------------------------------------------------------------

test.run();
