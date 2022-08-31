import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// opts.trimOnlySpaces
// -----------------------------------------------------------------------------

test("01 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all", () => {
  equal(
    stripHtml("\xa0 a \xa0", { trimOnlySpaces: true }).result,
    "\xa0 a \xa0",
    "01.01"
  );
  equal(stripHtml("a", { trimOnlySpaces: false }).result, "a", "01.02");
});

test("02 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all, trailing whitespace", () => {
  equal(
    stripHtml(" \xa0 a \xa0 ", { trimOnlySpaces: true }).result,
    "\xa0 a \xa0",
    "02.01"
  );
  equal(
    stripHtml(" \xa0 a \xa0 ", { trimOnlySpaces: false }).result,
    "a",
    "02.02"
  );
});

test("03 - opts.trimOnlySpaces - opts.trimOnlySpaces = on", () => {
  equal(
    stripHtml("\xa0 a \xa0", { trimOnlySpaces: true }).result,
    "\xa0 a \xa0",
    "03.01"
  );
  equal(
    stripHtml("\xa0 a \xa0", { trimOnlySpaces: false }).result,
    "a",
    "03.02"
  );
});

test("04 - opts.trimOnlySpaces - opts.trimOnlySpaces = on, loose", () => {
  equal(
    stripHtml(" \xa0 a \xa0 ", { trimOnlySpaces: true }).result,
    "\xa0 a \xa0",
    "04.01"
  );
  equal(
    stripHtml(" \xa0 a \xa0 ", { trimOnlySpaces: false }).result,
    "a",
    "04.02"
  );
});

test("05 - opts.trimOnlySpaces - default", () => {
  equal(stripHtml("\xa0 <article> \xa0").result, "", "05");
});

test("06 - opts.trimOnlySpaces - opts.trimOnlySpaces = on, tag", () => {
  equal(
    stripHtml("\xa0 <article> \xa0", { trimOnlySpaces: true }).result,
    "\xa0\xa0",
    "06.01"
  );
  equal(
    stripHtml("\xa0 <article> \xa0", { trimOnlySpaces: false }).result,
    "",
    "06.02"
  );
});

test("07 - opts.trimOnlySpaces - opts.trimOnlySpaces = on, two tags", () => {
  equal(
    stripHtml(" \xa0 <article> \xa0 <div> \xa0 ", { trimOnlySpaces: true })
      .result,
    "\xa0 \xa0",
    "07.01"
  );
  equal(
    stripHtml(" \xa0 <article> \xa0 <div> \xa0 ", { trimOnlySpaces: false })
      .result,
    "",
    "07.02"
  );
});

test("08 - opts.trimOnlySpaces - whitespace around", () => {
  equal(stripHtml(" \xa0 <article> \xa0 ").result, "", "08");
});

test("09 - opts.trimOnlySpaces - whitespace around, trimOnlySpaces = on", () => {
  equal(
    stripHtml(" \xa0 <article> \xa0 ", { trimOnlySpaces: true }).result,
    "\xa0\xa0",
    "09"
  );
});

test("10 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all", () => {
  equal(stripHtml(" \t a \n ").result, "a", "10");
});

test("11 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all - trimOnlySpaces = on", () => {
  equal(
    stripHtml(" \t a \n ", { trimOnlySpaces: true }).result,
    "\t a \n",
    "11"
  );
});

test("12 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all - CRLF", () => {
  equal(
    stripHtml(" \t\n a \r\n ", { trimOnlySpaces: true }).result,
    "\t\na \r\n",
    "12"
  );
});

test("13 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all - tag", () => {
  equal(stripHtml("\t\r\n <article> \t\r\n").result, "", "13");
});

test("14 - opts.trimOnlySpaces - tabs and CRLF", () => {
  equal(
    stripHtml("\t\r\n <article> \t\r\n", { trimOnlySpaces: true }).result,
    "\t\r\n\t\r\n",
    "14"
  );
});

test("15 - opts.trimOnlySpaces - spaced tabs and CRs, trimOnlySpaces = on", () => {
  equal(
    stripHtml(" \t \r \n <article> \t \r \n ", { trimOnlySpaces: true }).result,
    "\t \r \n\t \r \n",
    "15"
  );
});

test("16 - opts.trimOnlySpaces - combos of tags and whitespace, trimOnlySpaces = on", () => {
  equal(
    stripHtml(" \n <article> \xa0 <div> \xa0 </article> \t ", {
      trimOnlySpaces: true,
    }).result,
    "\n \t",
    "16"
  );
});

test("17 - opts.trimOnlySpaces - tags, trimOnlySpaces = on", () => {
  equal(
    stripHtml(" \na<article> \xa0 <div> \xa0 </article>b\t ", {
      trimOnlySpaces: true,
    }).result,
    "\na b\t",
    "17"
  );
});

test("18 - opts.trimOnlySpaces - letters around are retained", () => {
  equal(
    stripHtml(" \n a <article> \xa0 <div> \xa0 </article> b \t ", {
      trimOnlySpaces: true,
    }).result,
    "\na b \t",
    "18"
  );
});

test("19 - opts.trimOnlySpaces - opts.ignoreTags combo", () => {
  equal(
    stripHtml(" \n a <article> \xa0 <div> \xa0 </article> b \t ", {
      trimOnlySpaces: true,
      ignoreTags: ["div"],
    }).result,
    "\na <div> b \t",
    "19"
  );
});

test("20 - opts.trimOnlySpaces - opts.ignoreTags combo - plausible but recognised", () => {
  equal(
    stripHtml(" \n a <article> \xa0 < div> \xa0 </article> b \t ", {
      trimOnlySpaces: true,
      ignoreTags: ["div"],
    }).result,
    "\na < div> b \t",
    "20"
  );
});

test.run();
