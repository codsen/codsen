// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// comments
// -----------------------------------------------------------------------------

test("001 - strips HTML comments", () => {
  // group #1. spaces on both outsides
  equal(stripHtml("aaa <!-- <tr> --> bbb").result, "aaa bbb", "001.01");
  equal(stripHtml("aaa <!-- <tr>--> bbb").result, "aaa bbb", "001.02");
  equal(stripHtml("aaa <!--<tr> --> bbb").result, "aaa bbb", "001.03");
  equal(stripHtml("aaa <!--<tr>--> bbb").result, "aaa bbb", "001.04");

  // group #2. spaces on right only
  equal(stripHtml("aaa<!-- <tr> --> bbb").result, "aaa bbb", "001.05");
  equal(stripHtml("aaa<!-- <tr>--> bbb").result, "aaa bbb", "001.06");
  equal(stripHtml("aaa<!--<tr> --> bbb").result, "aaa bbb", "001.07");
  equal(stripHtml("aaa<!--<tr>--> bbb").result, "aaa bbb", "001.08");

  // group #3. spaces on left only
  equal(stripHtml("aaa <!-- <tr> -->bbb").result, "aaa bbb", "001.09");
  equal(stripHtml("aaa <!-- <tr>-->bbb").result, "aaa bbb", "001.10");
  equal(stripHtml("aaa <!--<tr> -->bbb").result, "aaa bbb", "001.11");
  equal(stripHtml("aaa <!--<tr>-->bbb").result, "aaa bbb", "001.12");

  // group #4. no spaces outside
  equal(stripHtml("aaa<!-- <tr> -->bbb").result, "aaa bbb", "001.13");
  equal(stripHtml("aaa<!-- <tr>-->bbb").result, "aaa bbb", "001.14");
  equal(stripHtml("aaa<!--<tr> -->bbb").result, "aaa bbb", "001.15");
  equal(stripHtml("aaa<!--<tr>-->bbb").result, "aaa bbb", "001.16");
});

test("002 - HTML comments around string edges", () => {
  equal(stripHtml("aaa <!-- <tr> --> ").result, "aaa", "002.01");
  equal(stripHtml("aaa <!-- <tr> -->").result, "aaa", "002.02");

  equal(stripHtml(" <!-- <tr> --> aaa").result, "aaa", "002.03");
  equal(stripHtml("<!-- <tr> -->aaa").result, "aaa", "002.04");

  equal(stripHtml(" <!-- <tr> --> aaa <!-- <tr> -->").result, "aaa", "002.05");
  equal(stripHtml("<!-- <tr> -->aaa<!-- <tr> -->").result, "aaa", "002.06");
  equal(
    stripHtml("   <!-- <tr> -->aaa<!-- <tr> -->   ").result,
    "aaa",
    "002.07",
  );
});

test("003 - false positives #1 - Nunjucks code", () => {
  equal(stripHtml("a< 2zzz==>b").result, "a< 2zzz==>b", "003.01");
});

test("004 - unclosed tag followed by another tag - range tag", () => {
  equal(stripHtml('<script>alert("123")</script<body>').result, "", "004.01");
});

test("005 - unclosed tag followed by self-closing tag", () => {
  equal(stripHtml('<script>alert("123")</script</body>').result, "", "005.01");
});

test("006 - unclosed tag followed by another tag", () => {
  equal(stripHtml('<script>alert("123")</script</ body>').result, "", "006.01");
});

test("007 - unclosed tag followed by another tag", () => {
  equal(stripHtml('<script>alert("123")</script<body/>').result, "", "007.01");
});

test("008 - unclosed tag followed by another unclosed tag", () => {
  equal(stripHtml('<script>alert("123")</script<body').result, "", "008.01");
});

test("009 - unclosed tag followed by another tag - non-range tag", () => {
  equal(
    stripHtml("<article>text here</article<body>").result,
    "text here",
    "009.01",
  );
});

test("010 - unclosed tag followed by another tag - non-range, self-closing tag", () => {
  equal(
    stripHtml("<article>text here</article</body>").result,
    "text here",
    "010.01",
  );
});

test("011 - unclosed tag followed by another tag - self-closing, inner whitespace", () => {
  equal(
    stripHtml("<article>text here</article</ body>").result,
    "text here",
    "011.01",
  );
});

test("012 - unclosed tag followed by another tag - with closing slash", () => {
  equal(
    stripHtml("<article>text here</article<body/>").result,
    "text here",
    "012.01",
  );
});

test("013 - unclosed tag followed by another tag - html", () => {
  equal(
    stripHtml("<article>text here</article<body").result,
    "text here",
    "013.01",
  );
});

test("014 - unclosed tag followed by another tag - strips many tags", () => {
  equal(
    stripHtml("a<something<anything<whatever<body<html").result,
    "a",
    "014.01",
  );
});

test("015 - unclosed tag followed by another tag - bails because of spaces", () => {
  equal(
    stripHtml("a < something < anything < whatever < body < html").result,
    "a < something < anything < whatever < body < html",
    "015.01",
  );
});

test("016 - range tags are overlapping - both default known range tags", () => {
  let { result, allTagLocations } = stripHtml(
    "<script>tra la <style>la</script>la la</style> rr",
  );
  equal(result, "la la rr", "016.01");
  equal(
    allTagLocations,
    [
      [0, 8],
      [24, 33],
      [38, 46],
    ],
    "016.02",
  );
});

test("017 - range tags are overlapping - both were just custom-set", () => {
  equal(
    stripHtml("<zzz>tra la <yyy>la</zzz>la la</yyy> rr", {
      stripTogetherWithTheirContents: ["zzz", "yyy"],
    }).result,
    "rr",
    "017.01",
  );
});

test("018 - range tags are overlapping - nested", () => {
  equal(
    stripHtml("<zzz>tra <script>la</script> la <yyy>la</zzz>la la</yyy> rr", {
      stripTogetherWithTheirContents: ["zzz", "yyy"],
    }).result,
    "rr",
    "018.01",
  );
});

test("019 - range tags are overlapping - wildcard", () => {
  equal(
    stripHtml("<zzz>tra <script>la</script> la <yyy>la</zzz>la la</yyy> rr", {
      stripTogetherWithTheirContents: ["*"],
    }).result,
    "rr",
    "019.01",
  );
});

test.run();
