import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// opts.ignoreTags
// -----------------------------------------------------------------------------

test("01 - opts.ignoreTags - empty string, whitespace string and null in the array", () => {
  equal(
    stripHtml("<a>", {
      ignoreTags: ["", " ", "a", "b", null],
    }).result,
    "<a>",
    "01.01",
  );
  equal(
    stripHtml("zzz", {
      ignoreTags: ["", " ", "a", "b", null],
    }).result,
    "zzz",
    "01.02",
  );
});

test("02 - opts.ignoreTags - null inside opts.ignoreTags array", () => {
  equal(
    stripHtml("<a>", {
      ignoreTags: [null],
    }).result,
    "",
    "02.01",
  );
  equal(
    stripHtml("zzz", {
      ignoreTags: [null],
    }).result,
    "zzz",
    "02.02",
  );
});

test("03 - opts.ignoreTags - empty str", () => {
  equal(
    stripHtml("<a>", {
      ignoreTags: [""],
    }).result,
    "",
    "03.01",
  );
  equal(
    stripHtml("zzz", {
      ignoreTags: [""],
    }).result,
    "zzz",
    "03.02",
  );
});

test("04 - opts.ignoreTags - empty str", () => {
  equal(
    stripHtml("<a>", {
      ignoreTags: "",
    }).result,
    "",
    "04.01",
  );
  equal(
    stripHtml("zz", {
      ignoreTags: "",
    }).result,
    "zz",
    "04.02",
  );
});

test("05 - opts.ignoreTags - empty str", () => {
  equal(
    stripHtml("<a>", {
      ignoreTags: "a",
    }).result,
    "<a>",
    "05.01",
  );
  equal(
    stripHtml("zzz", {
      ignoreTags: "a",
    }).result,
    "zzz",
    "05.02",
  );
});

test("06 - opts.ignoreTags - null among opts.ignoreTags values", () => {
  equal(
    stripHtml("<a>", {
      ignoreTags: [null, "a"],
    }).result,
    "<a>",
    "06.01",
  );
  equal(
    stripHtml("zzz", {
      ignoreTags: [null, "a"],
    }).result,
    "zzz",
    "06.02",
  );
});

test("07 - opts.ignoreTags - whitespace-only blanks inside opts.ignoreTags", () => {
  equal(
    stripHtml("a<a>", {
      ignoreTags: ["\t", "\n\n"],
    }).result,
    "a",
    "07.01",
  );
  equal(
    stripHtml("a z", {
      ignoreTags: ["\t", "\n\n"],
    }).result,
    "a z",
    "07.02",
  );
});

test("08 - opts.ignoreTags - tabs", () => {
  equal(
    stripHtml("a<a>", {
      ignoreTags: "\t",
    }).result,
    "a",
    "08.01",
  );
  equal(
    stripHtml("a z", {
      ignoreTags: "\t",
    }).result,
    "a z",
    "08.02",
  );
});

test("09 - opts.ignoreTags - some whitespace-only inside opts.ignoreTags", () => {
  equal(
    stripHtml("a<a>", {
      ignoreTags: ["\t", "\n\n", "a", " "],
    }).result,
    "a<a>",
    "09.01",
  );
  equal(
    stripHtml("zzz", {
      ignoreTags: ["\t", "\n\n", "a", " "],
    }).result,
    "zzz",
    "09.02",
  );
});

test("10 - opts.ignoreTags - space before and after attribute's equal character", () => {
  equal(
    stripHtml("<article  whatnot  =  whatyes = >zzz< / article>").result,
    "zzz",
    "10.01",
  );
});

test("11 - opts.ignoreTags - space before and after attribute's equal character", () => {
  equal(
    stripHtml(
      "<article  whatnot  =  whatyes = >xxx< / article> yyy <article  whatnot  =  whatyes = >zzz< / article>",
    ).result,
    "xxx yyy zzz",
    "11.01",
  );
});

test("12 - opts.ignoreTags - ignores single letter tag", () => {
  equal(
    stripHtml("Some <b>text</b> and some more <i>text</i>.", {
      ignoreTags: ["b"],
    }).result,
    "Some <b>text</b> and some more text.",
    "12.01",
  );
});

test("13 - opts.ignoreTags - ignores singleton tag", () => {
  equal(
    stripHtml("Some text <hr> some more <i>text</i>.", {
      ignoreTags: ["hr"],
    }).result,
    "Some text <hr> some more text.",
    "13.01",
  );
});

test("14 - opts.ignoreTags - ignores singleton tag, XHTML", () => {
  equal(
    stripHtml("Some text <hr/> some more <i>text</i>.", {
      ignoreTags: ["hr"],
    }).result,
    "Some text <hr/> some more text.",
    "14.01",
  );
});

test("15 - opts.ignoreTags - ignores singleton tag, spaced XHTML", () => {
  equal(
    stripHtml("Some text <hr / > some more <i>text</i>.", {
      ignoreTags: ["hr"],
    }).result,
    "Some text <hr / > some more text.",
    "15.01",
  );
});

test("16 - opts.ignoreTags - ignores single zzz tag", () => {
  equal(
    stripHtml("Some <zzz>text</zzz> and some more <i>text</i>.", {
      ignoreTags: ["zzz"],
    }).result,
    "Some <zzz>text</zzz> and some more text.",
    "16.01",
  );
});

test("17 - opts.ignoreTags - ignores zzz singleton tag", () => {
  equal(
    stripHtml("Some text <zzz> some more <i>text</i>.", {
      ignoreTags: ["zzz"],
    }).result,
    "Some text <zzz> some more text.",
    "17.01",
  );
});

test("18 - opts.ignoreTags - ignores default ranged tag", () => {
  equal(
    stripHtml("Some <script>text</script> and some more <i>text</i>.", {
      ignoreTags: ["script"],
    }).result,
    "Some <script>text</script> and some more text.",
    "18.01",
  );
});

test("19 - opts.ignoreTags - ignored tag unclosed, ending with EOF", () => {
  // just for kicks:
  equal(
    stripHtml("Some <b>text</b", {
      ignoreTags: ["b"],
    }).result,
    "Some <b>text</b",
    "19.01",
  );
});

test("20 - opts.ignoreTags - recognised unclosed singleton tag, HTML", () => {
  equal(
    stripHtml("Some text <hr", {
      ignoreTags: ["hr"],
    }).result,
    "Some text <hr",
    "20.01",
  );
});

test("21 - opts.ignoreTags - recognised unclosed singleton tag, XHTML", () => {
  equal(
    stripHtml("Some text <hr/", {
      ignoreTags: ["hr"],
    }).result,
    "Some text <hr/",
    "21.01",
  );
});

test("22 - opts.ignoreTags - kept the tag and the slash, just trimmed", () => {
  equal(
    stripHtml("Some text <hr / ", {
      ignoreTags: ["hr"],
    }).result,
    "Some text <hr /",
    "22.01",
  );
});

test("23 - opts.ignoreTags - ignores unclosed self-closing zzz tag", () => {
  equal(
    stripHtml("Some <zzz>text</zzz", {
      ignoreTags: ["zzz"],
    }).result,
    "Some <zzz>text</zzz",
    "23.01",
  );
});

test("24 - opts.ignoreTags - ignores unclosed zzz singleton tag", () => {
  equal(
    stripHtml("Some text <zzz", {
      ignoreTags: ["zzz"],
    }).result,
    "Some text <zzz",
    "24.01",
  );
});

test("25 - opts.ignoreTags - ignores default unclosed ranged tag", () => {
  equal(
    stripHtml("Some <script>text</script", {
      ignoreTags: ["script"],
    }).result,
    "Some <script>text</script",
    "25.01",
  );
});

test("26 - opts.ignoreTags - throws because of wrong type", () => {
  throws(
    () => {
      stripHtml("<a>", {
        ignoreTags: 1,
      });
    },
    /THROW_ID_05/,
    "26.01",
  );
});

test("27 - custom tags, no attrs", () => {
  equal(
    stripHtml("a<MyTag />b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a<MyTag />b c",
    "27.01",
  );
  equal(
    stripHtml("a<MyTag/>b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a<MyTag/>b c",
    "27.02",
  );
  equal(
    stripHtml("a<MyTag >b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a<MyTag >b c",
    "27.03",
  );
  equal(
    stripHtml("a<MyTag>b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a<MyTag>b c",
    "27.04",
  );
  equal(
    stripHtml("a</MyTag>b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a</MyTag>b c",
    "27.05",
  );
  equal(
    stripHtml("a</MyTag/>b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a</MyTag/>b c",
    "27.06",
  );
});

test("28 - custom tags, with attrs", () => {
  equal(
    stripHtml("a<MyTag zzz />b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a<MyTag zzz />b c",
    "28.01",
  );
  equal(
    stripHtml("a<MyTag zzz/>b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a<MyTag zzz/>b c",
    "28.02",
  );
  equal(
    stripHtml("a<MyTag zzz >b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a<MyTag zzz >b c",
    "28.03",
  );
  equal(
    stripHtml("a<MyTag zzz>b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a<MyTag zzz>b c",
    "28.04",
  );
  equal(
    stripHtml("a</MyTag zzz>b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a</MyTag zzz>b c",
    "28.05",
  );
  equal(
    stripHtml("a</MyTag zzz/>b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a</MyTag zzz/>b c",
    "28.06",
  );
});

test("29 - custom tags, with proper attrs", () => {
  equal(
    stripHtml('a<MyTag class="z" />b <div>c</div>', {
      ignoreTags: ["MyTag"],
    }).result,
    'a<MyTag class="z" />b c',
    "29.01",
  );
  equal(
    stripHtml('a<MyTag class="z"/>b <div>c</div>', {
      ignoreTags: ["MyTag"],
    }).result,
    'a<MyTag class="z"/>b c',
    "29.02",
  );
  equal(
    stripHtml('a<MyTag class="z" >b <div>c</div>', {
      ignoreTags: ["MyTag"],
    }).result,
    'a<MyTag class="z" >b c',
    "29.03",
  );
  equal(
    stripHtml('a<MyTag class="z">b <div>c</div>', {
      ignoreTags: ["MyTag"],
    }).result,
    'a<MyTag class="z">b c',
    "29.04",
  );
  equal(
    stripHtml('a</MyTag class="z">b <div>c</div>', {
      ignoreTags: ["MyTag"],
    }).result,
    'a</MyTag class="z">b c',
    "29.05",
  );
  equal(
    stripHtml('a</MyTag class="z"/>b <div>c</div>', {
      ignoreTags: ["MyTag"],
    }).result,
    'a</MyTag class="z"/>b c',
    "29.06",
  );
});

test.run();
