// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// opts.trimOnlySpaces
// -----------------------------------------------------------------------------

test("001 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all", () => {
  equal(
    stripHtml("\xa0 a \xa0", { trimOnlySpaces: true }).result,
    "\xa0 a \xa0",
    "001.01",
  );
  equal(stripHtml("a", { trimOnlySpaces: false }).result, "a", "001.02");
});

test("002 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all, trailing whitespace", () => {
  equal(
    stripHtml(" \xa0 a \xa0 ", { trimOnlySpaces: true }).result,
    "\xa0 a \xa0",
    "002.01",
  );
  equal(
    stripHtml(" \xa0 a \xa0 ", { trimOnlySpaces: false }).result,
    "a",
    "002.02",
  );
});

test("003 - opts.trimOnlySpaces - opts.trimOnlySpaces = on", () => {
  equal(
    stripHtml("\xa0 a \xa0", { trimOnlySpaces: true }).result,
    "\xa0 a \xa0",
    "003.01",
  );
  equal(
    stripHtml("\xa0 a \xa0", { trimOnlySpaces: false }).result,
    "a",
    "003.02",
  );
});

test("004 - opts.trimOnlySpaces - opts.trimOnlySpaces = on, loose", () => {
  equal(
    stripHtml(" \xa0 a \xa0 ", { trimOnlySpaces: true }).result,
    "\xa0 a \xa0",
    "004.01",
  );
  equal(
    stripHtml(" \xa0 a \xa0 ", { trimOnlySpaces: false }).result,
    "a",
    "004.02",
  );
});

test("005 - opts.trimOnlySpaces - default", () => {
  equal(stripHtml("\xa0 <article> \xa0").result, "", "005.01");
});

test("006 - opts.trimOnlySpaces - opts.trimOnlySpaces = on, tag", () => {
  equal(
    stripHtml("\xa0 <article> \xa0", { trimOnlySpaces: true }).result,
    "\xa0\xa0",
    "006.01",
  );
  equal(
    stripHtml("\xa0 <article> \xa0", { trimOnlySpaces: false }).result,
    "",
    "006.02",
  );
});

test("007 - opts.trimOnlySpaces - opts.trimOnlySpaces = on, two tags", () => {
  equal(
    stripHtml(" \xa0 <article> \xa0 <div> \xa0 ", { trimOnlySpaces: true })
      .result,
    "\xa0 \xa0",
    "007.01",
  );
  equal(
    stripHtml(" \xa0 <article> \xa0 <div> \xa0 ", { trimOnlySpaces: false })
      .result,
    "",
    "007.02",
  );
});

test("008 - opts.trimOnlySpaces - whitespace around", () => {
  equal(stripHtml(" \xa0 <article> \xa0 ").result, "", "008.01");
});

test("009 - opts.trimOnlySpaces - whitespace around, trimOnlySpaces = on", () => {
  equal(
    stripHtml(" \xa0 <article> \xa0 ", { trimOnlySpaces: true }).result,
    "\xa0\xa0",
    "009.01",
  );
});

test("010 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all", () => {
  equal(stripHtml(" \t a \n ").result, "a", "010.01");
});

test("011 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all - trimOnlySpaces = on", () => {
  equal(
    stripHtml(" \t a \n ", { trimOnlySpaces: true }).result,
    "\t a \n",
    "011.01",
  );
});

test("012 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all - CRLF", () => {
  equal(
    stripHtml(" \t\n a \r\n ", { trimOnlySpaces: true }).result,
    "\t\na \r\n",
    "012.01",
  );
});

test("013 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all - tag", () => {
  equal(stripHtml("\t\r\n <article> \t\r\n").result, "", "013.01");
});

test("014 - opts.trimOnlySpaces - tabs and CRLF", () => {
  equal(
    stripHtml("\t\r\n <article> \t\r\n", { trimOnlySpaces: true }).result,
    "\t\r\n\t\r\n",
    "014.01",
  );
});

test("015 - opts.trimOnlySpaces - spaced tabs and CRs, trimOnlySpaces = on", () => {
  equal(
    stripHtml(" \t \r \n <article> \t \r \n ", { trimOnlySpaces: true }).result,
    "\t \r \n\t \r \n",
    "015.01",
  );
});

test("016 - opts.trimOnlySpaces - combos of tags and whitespace, trimOnlySpaces = on", () => {
  equal(
    stripHtml(" \n <article> \xa0 <div> \xa0 </article> \t ", {
      trimOnlySpaces: true,
    }).result,
    "\n \t",
    "016.01",
  );
});

test("017 - opts.trimOnlySpaces - tags, trimOnlySpaces = on", () => {
  equal(
    stripHtml(" \na<article> \xa0 <div> \xa0 </article>b\t ", {
      trimOnlySpaces: true,
    }).result,
    "\na b\t",
    "017.01",
  );
});

test("018 - opts.trimOnlySpaces - letters around are retained", () => {
  equal(
    stripHtml(" \n a <article> \xa0 <div> \xa0 </article> b \t ", {
      trimOnlySpaces: true,
    }).result,
    "\na b \t",
    "018.01",
  );
});

test("019 - opts.trimOnlySpaces - opts.ignoreTags combo", () => {
  equal(
    stripHtml(" \n a <article> \xa0 <div> \xa0 </article> b \t ", {
      trimOnlySpaces: true,
      ignoreTags: ["div"],
    }).result,
    "\na <div> b \t",
    "019.01",
  );
});

test("020 - opts.trimOnlySpaces - opts.ignoreTags combo - plausible but recognised", () => {
  equal(
    stripHtml(" \n a <article> \xa0 < div> \xa0 </article> b \t ", {
      trimOnlySpaces: true,
      ignoreTags: ["div"],
    }).result,
    "\na < div> b \t",
    "020.01",
  );
});

test.run();
