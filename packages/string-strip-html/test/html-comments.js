import tap from "tap";
import { stripHtml } from "../dist/string-strip-html.esm.js";

// comments
// -----------------------------------------------------------------------------

tap.test("01 - strips HTML comments", (t) => {
  // group #1. spaces on both outsides
  t.hasStrict(
    stripHtml("aaa <!-- <tr> --> bbb"),
    { result: "aaa bbb" },
    "01.01 - double space"
  );
  t.hasStrict(
    stripHtml("aaa <!-- <tr>--> bbb"),
    { result: "aaa bbb" },
    "01.02 - single space"
  );
  t.hasStrict(
    stripHtml("aaa <!--<tr> --> bbb"),
    { result: "aaa bbb" },
    "01.03 - single space"
  );
  t.hasStrict(
    stripHtml("aaa <!--<tr>--> bbb"),
    { result: "aaa bbb" },
    "01.04 - no space"
  );

  // group #2. spaces on right only
  t.hasStrict(
    stripHtml("aaa<!-- <tr> --> bbb"),
    { result: "aaa bbb" },
    "01.05 - double space"
  );
  t.hasStrict(
    stripHtml("aaa<!-- <tr>--> bbb"),
    { result: "aaa bbb" },
    "01.06 - single space"
  );
  t.hasStrict(
    stripHtml("aaa<!--<tr> --> bbb"),
    { result: "aaa bbb" },
    "01.07 - single space"
  );
  t.hasStrict(
    stripHtml("aaa<!--<tr>--> bbb"),
    { result: "aaa bbb" },
    "01.08 - no space"
  );

  // group #3. spaces on left only
  t.hasStrict(
    stripHtml("aaa <!-- <tr> -->bbb"),
    { result: "aaa bbb" },
    "01.09 - double space"
  );
  t.hasStrict(
    stripHtml("aaa <!-- <tr>-->bbb"),
    { result: "aaa bbb" },
    "01.10 - single space"
  );
  t.hasStrict(
    stripHtml("aaa <!--<tr> -->bbb"),
    { result: "aaa bbb" },
    "01.11 - single space"
  );
  t.hasStrict(
    stripHtml("aaa <!--<tr>-->bbb"),
    { result: "aaa bbb" },
    "01.12 - no space"
  );

  // group #4. no spaces outside
  t.hasStrict(
    stripHtml("aaa<!-- <tr> -->bbb"),
    { result: "aaa bbb" },
    "01.13 - double space"
  );
  t.hasStrict(
    stripHtml("aaa<!-- <tr>-->bbb"),
    { result: "aaa bbb" },
    "01.14 - single space"
  );
  t.hasStrict(
    stripHtml("aaa<!--<tr> -->bbb"),
    { result: "aaa bbb" },
    "01.15 - single space"
  );
  t.hasStrict(
    stripHtml("aaa<!--<tr>-->bbb"),
    { result: "aaa bbb" },
    "01.16 - no space"
  );
  t.end();
});

tap.test("02 - HTML comments around string edges", (t) => {
  t.hasStrict(stripHtml("aaa <!-- <tr> --> "), { result: "aaa" }, "02.01");
  t.hasStrict(stripHtml("aaa <!-- <tr> -->"), { result: "aaa" }, "02.02");

  t.hasStrict(stripHtml(" <!-- <tr> --> aaa"), { result: "aaa" }, "02.03");
  t.hasStrict(stripHtml("<!-- <tr> -->aaa"), { result: "aaa" }, "02.04");

  t.hasStrict(
    stripHtml(" <!-- <tr> --> aaa <!-- <tr> -->"),
    { result: "aaa" },
    "02.05"
  );
  t.hasStrict(
    stripHtml("<!-- <tr> -->aaa<!-- <tr> -->"),
    { result: "aaa" },
    "02.06"
  );
  t.hasStrict(
    stripHtml("   <!-- <tr> -->aaa<!-- <tr> -->   "),
    { result: "aaa" },
    "02.07"
  );
  t.end();
});

tap.test("03 - false positives #1 - Nunjucks code", (t) => {
  t.hasStrict(stripHtml("a< 2zzz==>b"), { result: "a< 2zzz==>b" }, "03");
  t.end();
});

tap.test("04 - unclosed tag followed by another tag - range tag", (t) => {
  t.hasStrict(
    stripHtml('<script>alert("123")</script<body>'),
    { result: "" },
    "04"
  );
  t.end();
});

tap.test("05 - unclosed tag followed by self-closing tag", (t) => {
  t.hasStrict(
    stripHtml('<script>alert("123")</script</body>'),
    { result: "" },
    "05"
  );
  t.end();
});

tap.test("06 - unclosed tag followed by another tag", (t) => {
  t.hasStrict(
    stripHtml('<script>alert("123")</script</ body>'),
    { result: "" },
    "06"
  );
  t.end();
});

tap.test("07 - unclosed tag followed by another tag", (t) => {
  t.hasStrict(
    stripHtml('<script>alert("123")</script<body/>'),
    { result: "" },
    "07"
  );
  t.end();
});

tap.test("08 - unclosed tag followed by another unclosed tag", (t) => {
  t.hasStrict(
    stripHtml('<script>alert("123")</script<body'),
    { result: "" },
    "08"
  );
  t.end();
});

tap.test("09 - unclosed tag followed by another tag - non-range tag", (t) => {
  t.hasStrict(
    stripHtml("<article>text here</article<body>"),
    { result: "text here" },
    "09"
  );
  t.end();
});

tap.test(
  "10 - unclosed tag followed by another tag - non-range, self-closing tag",
  (t) => {
    t.hasStrict(
      stripHtml("<article>text here</article</body>"),
      { result: "text here" },
      "10"
    );
    t.end();
  }
);

tap.test(
  "11 - unclosed tag followed by another tag - self-closing, inner whitespace",
  (t) => {
    t.hasStrict(
      stripHtml("<article>text here</article</ body>"),
      { result: "text here" },
      "11"
    );
    t.end();
  }
);

tap.test(
  "12 - unclosed tag followed by another tag - with closing slash",
  (t) => {
    t.hasStrict(
      stripHtml("<article>text here</article<body/>"),
      { result: "text here" },
      "12"
    );
    t.end();
  }
);

tap.test("13 - unclosed tag followed by another tag - html", (t) => {
  t.hasStrict(
    stripHtml("<article>text here</article<body"),
    { result: "text here" },
    "13"
  );
  t.end();
});

tap.test(
  "14 - unclosed tag followed by another tag - strips many tags",
  (t) => {
    t.hasStrict(
      stripHtml("a<something<anything<whatever<body<html"),
      { result: "a" },
      "14"
    );
    t.end();
  }
);

tap.test(
  "15 - unclosed tag followed by another tag - bails because of spaces",
  (t) => {
    t.hasStrict(
      stripHtml("a < something < anything < whatever < body < html"),
      { result: "a < something < anything < whatever < body < html" },
      "15"
    );
    t.end();
  }
);

tap.test(
  "16 - range tags are overlapping - both default known range tags",
  (t) => {
    t.hasStrict(
      stripHtml("<script>tra la <style>la</script>la la</style> rr"),
      { result: "rr" },
      "16"
    );
    t.end();
  }
);

tap.test("17 - range tags are overlapping - both were just custom-set", (t) => {
  t.hasStrict(
    stripHtml("<zzz>tra la <yyy>la</zzz>la la</yyy> rr", {
      stripTogetherWithTheirContents: ["zzz", "yyy"],
    }),
    { result: "rr" },
    "17"
  );
  t.end();
});

tap.test("18 - range tags are overlapping - nested", (t) => {
  t.hasStrict(
    stripHtml("<zzz>tra <script>la</script> la <yyy>la</zzz>la la</yyy> rr", {
      stripTogetherWithTheirContents: ["zzz", "yyy"],
    }),
    { result: "rr" },
    "18"
  );
  t.end();
});

tap.test("19 - range tags are overlapping - wildcard", (t) => {
  t.hasStrict(
    stripHtml("<zzz>tra <script>la</script> la <yyy>la</zzz>la la</yyy> rr", {
      stripTogetherWithTheirContents: ["*"],
    }),
    { result: "rr" },
    "19"
  );
  t.end();
});
