import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// comments
// -----------------------------------------------------------------------------

test("01 - strips HTML comments", () => {
  // group #1. spaces on both outsides
  equal(
    stripHtml("aaa <!-- <tr> --> bbb").result,
    "aaa bbb",
    "01.01 - double space"
  );
  equal(
    stripHtml("aaa <!-- <tr>--> bbb").result,
    "aaa bbb",
    "01.02 - single space"
  );
  equal(
    stripHtml("aaa <!--<tr> --> bbb").result,
    "aaa bbb",
    "01.03 - single space"
  );
  equal(stripHtml("aaa <!--<tr>--> bbb").result, "aaa bbb", "01.04 - no space");

  // group #2. spaces on right only
  equal(
    stripHtml("aaa<!-- <tr> --> bbb").result,
    "aaa bbb",
    "01.05 - double space"
  );
  equal(
    stripHtml("aaa<!-- <tr>--> bbb").result,
    "aaa bbb",
    "01.06 - single space"
  );
  equal(
    stripHtml("aaa<!--<tr> --> bbb").result,
    "aaa bbb",
    "01.07 - single space"
  );
  equal(stripHtml("aaa<!--<tr>--> bbb").result, "aaa bbb", "01.08 - no space");

  // group #3. spaces on left only
  equal(
    stripHtml("aaa <!-- <tr> -->bbb").result,
    "aaa bbb",
    "01.09 - double space"
  );
  equal(
    stripHtml("aaa <!-- <tr>-->bbb").result,
    "aaa bbb",
    "01.10 - single space"
  );
  equal(
    stripHtml("aaa <!--<tr> -->bbb").result,
    "aaa bbb",
    "01.11 - single space"
  );
  equal(stripHtml("aaa <!--<tr>-->bbb").result, "aaa bbb", "01.12 - no space");

  // group #4. no spaces outside
  equal(
    stripHtml("aaa<!-- <tr> -->bbb").result,
    "aaa bbb",
    "01.13 - double space"
  );
  equal(
    stripHtml("aaa<!-- <tr>-->bbb").result,
    "aaa bbb",
    "01.14 - single space"
  );
  equal(
    stripHtml("aaa<!--<tr> -->bbb").result,
    "aaa bbb",
    "01.15 - single space"
  );
  equal(stripHtml("aaa<!--<tr>-->bbb").result, "aaa bbb", "01.16 - no space");
});

test("02 - HTML comments around string edges", () => {
  equal(stripHtml("aaa <!-- <tr> --> ").result, "aaa", "02.01");
  equal(stripHtml("aaa <!-- <tr> -->").result, "aaa", "02.02");

  equal(stripHtml(" <!-- <tr> --> aaa").result, "aaa", "02.03");
  equal(stripHtml("<!-- <tr> -->aaa").result, "aaa", "02.04");

  equal(stripHtml(" <!-- <tr> --> aaa <!-- <tr> -->").result, "aaa", "02.05");
  equal(stripHtml("<!-- <tr> -->aaa<!-- <tr> -->").result, "aaa", "02.06");
  equal(
    stripHtml("   <!-- <tr> -->aaa<!-- <tr> -->   ").result,
    "aaa",
    "02.07"
  );
});

test("03 - false positives #1 - Nunjucks code", () => {
  equal(stripHtml("a< 2zzz==>b").result, "a< 2zzz==>b", "03");
});

test("04 - unclosed tag followed by another tag - range tag", () => {
  equal(stripHtml('<script>alert("123")</script<body>').result, "", "04");
});

test("05 - unclosed tag followed by self-closing tag", () => {
  equal(stripHtml('<script>alert("123")</script</body>').result, "", "05");
});

test("06 - unclosed tag followed by another tag", () => {
  equal(stripHtml('<script>alert("123")</script</ body>').result, "", "06");
});

test("07 - unclosed tag followed by another tag", () => {
  equal(stripHtml('<script>alert("123")</script<body/>').result, "", "07");
});

test("08 - unclosed tag followed by another unclosed tag", () => {
  equal(stripHtml('<script>alert("123")</script<body').result, "", "08");
});

test("09 - unclosed tag followed by another tag - non-range tag", () => {
  equal(
    stripHtml("<article>text here</article<body>").result,
    "text here",
    "09"
  );
});

test("10 - unclosed tag followed by another tag - non-range, self-closing tag", () => {
  equal(
    stripHtml("<article>text here</article</body>").result,
    "text here",
    "10"
  );
});

test("11 - unclosed tag followed by another tag - self-closing, inner whitespace", () => {
  equal(
    stripHtml("<article>text here</article</ body>").result,
    "text here",
    "11"
  );
});

test("12 - unclosed tag followed by another tag - with closing slash", () => {
  equal(
    stripHtml("<article>text here</article<body/>").result,
    "text here",
    "12"
  );
});

test("13 - unclosed tag followed by another tag - html", () => {
  equal(
    stripHtml("<article>text here</article<body").result,
    "text here",
    "13"
  );
});

test("14 - unclosed tag followed by another tag - strips many tags", () => {
  equal(stripHtml("a<something<anything<whatever<body<html").result, "a", "14");
});

test("15 - unclosed tag followed by another tag - bails because of spaces", () => {
  equal(
    stripHtml("a < something < anything < whatever < body < html").result,
    "a < something < anything < whatever < body < html",
    "15"
  );
});

test("16 - range tags are overlapping - both default known range tags", () => {
  equal(
    stripHtml("<script>tra la <style>la</script>la la</style> rr").result,
    "rr",
    "16"
  );
});

test("17 - range tags are overlapping - both were just custom-set", () => {
  equal(
    stripHtml("<zzz>tra la <yyy>la</zzz>la la</yyy> rr", {
      stripTogetherWithTheirContents: ["zzz", "yyy"],
    }).result,
    "rr",
    "17"
  );
});

test("18 - range tags are overlapping - nested", () => {
  equal(
    stripHtml("<zzz>tra <script>la</script> la <yyy>la</zzz>la la</yyy> rr", {
      stripTogetherWithTheirContents: ["zzz", "yyy"],
    }).result,
    "rr",
    "18"
  );
});

test("19 - range tags are overlapping - wildcard", () => {
  equal(
    stripHtml("<zzz>tra <script>la</script> la <yyy>la</zzz>la la</yyy> rr", {
      stripTogetherWithTheirContents: ["*"],
    }).result,
    "rr",
    "19"
  );
});

test.run();
