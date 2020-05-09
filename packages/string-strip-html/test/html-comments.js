import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// comments
// -----------------------------------------------------------------------------

tap.test("01 - strips HTML comments", (t) => {
  // group #1. spaces on both outsides
  t.same(stripHtml("aaa <!-- <tr> --> bbb"), "aaa bbb", "01.01 - double space");
  t.same(stripHtml("aaa <!-- <tr>--> bbb"), "aaa bbb", "01.02 - single space");
  t.same(stripHtml("aaa <!--<tr> --> bbb"), "aaa bbb", "01.03 - single space");
  t.same(stripHtml("aaa <!--<tr>--> bbb"), "aaa bbb", "01.04 - no space");

  // group #2. spaces on right only
  t.same(stripHtml("aaa<!-- <tr> --> bbb"), "aaa bbb", "01.05 - double space");
  t.same(stripHtml("aaa<!-- <tr>--> bbb"), "aaa bbb", "01.06 - single space");
  t.same(stripHtml("aaa<!--<tr> --> bbb"), "aaa bbb", "01.07 - single space");
  t.same(stripHtml("aaa<!--<tr>--> bbb"), "aaa bbb", "01.08 - no space");

  // group #3. spaces on left only
  t.same(stripHtml("aaa <!-- <tr> -->bbb"), "aaa bbb", "01.09 - double space");
  t.same(stripHtml("aaa <!-- <tr>-->bbb"), "aaa bbb", "01.10 - single space");
  t.same(stripHtml("aaa <!--<tr> -->bbb"), "aaa bbb", "01.11 - single space");
  t.same(stripHtml("aaa <!--<tr>-->bbb"), "aaa bbb", "01.12 - no space");

  // group #4. no spaces outside
  t.same(stripHtml("aaa<!-- <tr> -->bbb"), "aaa bbb", "01.13 - double space");
  t.same(stripHtml("aaa<!-- <tr>-->bbb"), "aaa bbb", "01.14 - single space");
  t.same(stripHtml("aaa<!--<tr> -->bbb"), "aaa bbb", "01.15 - single space");
  t.same(stripHtml("aaa<!--<tr>-->bbb"), "aaa bbb", "01.16 - no space");
  t.end();
});

tap.test("02 - HTML comments around string edges", (t) => {
  t.same(stripHtml("aaa <!-- <tr> --> "), "aaa", "02.01");
  t.same(stripHtml("aaa <!-- <tr> -->"), "aaa", "02.02");

  t.same(stripHtml(" <!-- <tr> --> aaa"), "aaa", "02.03");
  t.same(stripHtml("<!-- <tr> -->aaa"), "aaa", "02.04");

  t.same(stripHtml(" <!-- <tr> --> aaa <!-- <tr> -->"), "aaa", "02.05");
  t.same(stripHtml("<!-- <tr> -->aaa<!-- <tr> -->"), "aaa", "02.06");
  t.same(stripHtml("   <!-- <tr> -->aaa<!-- <tr> -->   "), "aaa", "02.07");
  t.end();
});

tap.test("03 - range tag is unclosed", (t) => {
  // no content besides ranged tag:
  t.same(stripHtml('<script>alert("123")</script'), "", "03.01");
  t.same(stripHtml("<script>alert('123')</script"), "", "03.02");
  t.same(stripHtml('<script>alert("123")<script'), "", "03.03");
  t.same(stripHtml("<script>alert('123')<script"), "", "03.04");
  t.same(stripHtml('<script>alert("123")</ script'), "", "03.05");
  t.same(stripHtml("<script>alert('123')</ script"), "", "03.06");

  // single letter left:
  t.same(stripHtml('a<script>alert("123")</script'), "a", "03.07");
  t.same(stripHtml("a<script>alert('123')</script"), "a", "03.08");
  t.same(stripHtml('a<script>alert("123")<script'), "a", "03.09");
  t.same(stripHtml("a<script>alert('123')<script"), "a", "03.10");
  t.same(stripHtml('a<script>alert("123")</ script'), "a", "03.11");
  t.same(stripHtml("a<script>alert('123')</ script"), "a", "03.12");

  // script excluded from ranged tags, so now only tags are removed, no contents between:
  t.same(
    stripHtml('a<script>alert("123")</script', {
      stripTogetherWithTheirContents: [],
    }),
    'a alert("123")',
    "03.13"
  );
  t.same(
    stripHtml("a<script>alert('123')</script", {
      stripTogetherWithTheirContents: [],
    }),
    "a alert('123')",
    "03.14"
  );
  t.same(
    stripHtml('a<script>alert("123")<script', {
      stripTogetherWithTheirContents: [],
    }),
    'a alert("123")',
    "03.15"
  );
  t.same(
    stripHtml("a<script>alert('123')<script", {
      stripTogetherWithTheirContents: [],
    }),
    "a alert('123')",
    "03.16"
  );
  t.same(
    stripHtml('a<script>alert("123")</ script', {
      stripTogetherWithTheirContents: [],
    }),
    'a alert("123")',
    "03.17"
  );
  t.same(
    stripHtml("a<script>alert('123')</ script", {
      stripTogetherWithTheirContents: [],
    }),
    "a alert('123')",
    "03.18"
  );

  // script tag ignored and left intact (opts.ignoreTags):
  t.same(
    stripHtml('a<script>alert("123")</script', { ignoreTags: ["script"] }),
    'a<script>alert("123")</script',
    "03.19"
  );
  t.same(
    stripHtml("a<script>alert('123')</script", { ignoreTags: ["script"] }),
    "a<script>alert('123')</script",
    "03.20"
  );
  t.same(
    stripHtml('a<script>alert("123")<script', { ignoreTags: ["script"] }),
    'a<script>alert("123")<script',
    "03.21"
  );
  t.same(
    stripHtml("a<script>alert('123')<script", { ignoreTags: ["script"] }),
    "a<script>alert('123')<script",
    "03.22"
  );
  t.same(
    stripHtml('a<script>alert("123")</ script', { ignoreTags: ["script"] }),
    'a<script>alert("123")</ script',
    "03.23"
  );
  t.same(
    stripHtml("a<script>alert('123')</ script", { ignoreTags: ["script"] }),
    "a<script>alert('123')</ script",
    "03.24"
  );
  t.end();
});

tap.test("04 - false positives #1 - Nunjucks code", (t) => {
  t.same(stripHtml("a< 2zzz==>b"), "a< 2zzz==>b", "04");
  t.end();
});

tap.test("05 - unclosed tag followed by another tag - range tag", (t) => {
  t.same(stripHtml('<script>alert("123")</script<body>'), "", "05");
  t.end();
});

tap.test("06 - unclosed tag followed by self-closing tag", (t) => {
  t.same(stripHtml('<script>alert("123")</script</body>'), "", "06");
  t.end();
});

tap.test("07 - unclosed tag followed by another tag", (t) => {
  t.same(stripHtml('<script>alert("123")</script</ body>'), "", "07");
  t.end();
});

tap.test("08 - unclosed tag followed by another tag", (t) => {
  t.same(stripHtml('<script>alert("123")</script<body/>'), "", "08");
  t.end();
});

tap.test("09 - unclosed tag followed by another unclosed tag", (t) => {
  t.same(stripHtml('<script>alert("123")</script<body'), "", "09");
  t.end();
});

tap.test("10 - unclosed tag followed by another tag - non-range tag", (t) => {
  t.same(stripHtml("<article>text here</article<body>"), "text here", "10");
  t.end();
});

tap.test(
  "11 - unclosed tag followed by another tag - non-range, self-closing tag",
  (t) => {
    t.same(stripHtml("<article>text here</article</body>"), "text here", "11");
    t.end();
  }
);

tap.test(
  "12 - unclosed tag followed by another tag - self-closing, inner whitespace",
  (t) => {
    t.same(stripHtml("<article>text here</article</ body>"), "text here", "12");
    t.end();
  }
);

tap.test(
  "13 - unclosed tag followed by another tag - with closing slash",
  (t) => {
    t.same(stripHtml("<article>text here</article<body/>"), "text here", "13");
    t.end();
  }
);

tap.test("14 - unclosed tag followed by another tag - html", (t) => {
  t.same(stripHtml("<article>text here</article<body"), "text here", "14");
  t.end();
});

tap.test(
  "15 - unclosed tag followed by another tag - strips many tags",
  (t) => {
    t.same(stripHtml("a<something<anything<whatever<body<html"), "a", "15");
    t.end();
  }
);

tap.test(
  "16 - unclosed tag followed by another tag - bails because of spaces",
  (t) => {
    t.same(
      stripHtml("a < something < anything < whatever < body < html"),
      "a < something < anything < whatever < body < html",
      "16"
    );
    t.end();
  }
);

tap.test(
  "17 - range tags are overlapping - both default known range tags",
  (t) => {
    t.same(
      stripHtml("<script>tra la <style>la</script>la la</style> rr"),
      "rr",
      "17"
    );
    t.end();
  }
);

tap.test("18 - range tags are overlapping - both were just custom-set", (t) => {
  t.same(
    stripHtml("<zzz>tra la <yyy>la</zzz>la la</yyy> rr", {
      stripTogetherWithTheirContents: ["zzz", "yyy"],
    }),
    "rr",
    "18"
  );
  t.end();
});

tap.test("19 - range tags are overlapping - nested", (t) => {
  t.same(
    stripHtml("<zzz>tra <script>la</script> la <yyy>la</zzz>la la</yyy> rr", {
      stripTogetherWithTheirContents: ["zzz", "yyy"],
    }),
    "rr",
    "19"
  );
  t.end();
});
