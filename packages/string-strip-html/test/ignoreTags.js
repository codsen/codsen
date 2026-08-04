// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// opts.ignoreTags
// -----------------------------------------------------------------------------

test("001 - opts.ignoreTags - empty string, whitespace string and null in the array", () => {
  equal(
    stripHtml("<a>", {
      ignoreTags: ["", " ", "a", "b", null],
    }).result,
    "<a>",
    "001.01",
  );
  equal(
    stripHtml("zzz", {
      ignoreTags: ["", " ", "a", "b", null],
    }).result,
    "zzz",
    "001.02",
  );
});

test("002 - opts.ignoreTags - null inside opts.ignoreTags array", () => {
  equal(
    stripHtml("<a>", {
      ignoreTags: [null],
    }).result,
    "",
    "002.01",
  );
  equal(
    stripHtml("zzz", {
      ignoreTags: [null],
    }).result,
    "zzz",
    "002.02",
  );
});

test("003 - opts.ignoreTags - empty str", () => {
  equal(
    stripHtml("<a>", {
      ignoreTags: [""],
    }).result,
    "",
    "003.01",
  );
  equal(
    stripHtml("zzz", {
      ignoreTags: [""],
    }).result,
    "zzz",
    "003.02",
  );
});

test("004 - opts.ignoreTags - empty str", () => {
  equal(
    stripHtml("<a>", {
      ignoreTags: "",
    }).result,
    "",
    "004.01",
  );
  equal(
    stripHtml("zz", {
      ignoreTags: "",
    }).result,
    "zz",
    "004.02",
  );
});

test("005 - opts.ignoreTags - empty str", () => {
  equal(
    stripHtml("<a>", {
      ignoreTags: "a",
    }).result,
    "<a>",
    "005.01",
  );
  equal(
    stripHtml("zzz", {
      ignoreTags: "a",
    }).result,
    "zzz",
    "005.02",
  );
});

test("006 - opts.ignoreTags - null among opts.ignoreTags values", () => {
  equal(
    stripHtml("<a>", {
      ignoreTags: [null, "a"],
    }).result,
    "<a>",
    "006.01",
  );
  equal(
    stripHtml("zzz", {
      ignoreTags: [null, "a"],
    }).result,
    "zzz",
    "006.02",
  );
});

test("007 - opts.ignoreTags - whitespace-only blanks inside opts.ignoreTags", () => {
  equal(
    stripHtml("a<a>", {
      ignoreTags: ["\t", "\n\n"],
    }).result,
    "a",
    "007.01",
  );
  equal(
    stripHtml("a z", {
      ignoreTags: ["\t", "\n\n"],
    }).result,
    "a z",
    "007.02",
  );
});

test("008 - opts.ignoreTags - tabs", () => {
  equal(
    stripHtml("a<a>", {
      ignoreTags: "\t",
    }).result,
    "a",
    "008.01",
  );
  equal(
    stripHtml("a z", {
      ignoreTags: "\t",
    }).result,
    "a z",
    "008.02",
  );
});

test("009 - opts.ignoreTags - some whitespace-only inside opts.ignoreTags", () => {
  equal(
    stripHtml("a<a>", {
      ignoreTags: ["\t", "\n\n", "a", " "],
    }).result,
    "a<a>",
    "009.01",
  );
  equal(
    stripHtml("zzz", {
      ignoreTags: ["\t", "\n\n", "a", " "],
    }).result,
    "zzz",
    "009.02",
  );
});

test("010 - opts.ignoreTags - space before and after attribute's equal character", () => {
  equal(
    stripHtml("<article  whatnot  =  whatyes = >zzz< / article>").result,
    "zzz",
    "010.01",
  );
});

test("011 - opts.ignoreTags - space before and after attribute's equal character", () => {
  equal(
    stripHtml(
      "<article  whatnot  =  whatyes = >xxx< / article> yyy <article  whatnot  =  whatyes = >zzz< / article>",
    ).result,
    "xxx yyy zzz",
    "011.01",
  );
});

test("012 - opts.ignoreTags - ignores single letter tag", () => {
  equal(
    stripHtml("Some <b>text</b> and some more <i>text</i>.", {
      ignoreTags: ["b"],
    }).result,
    "Some <b>text</b> and some more text.",
    "012.01",
  );
});

test("013 - opts.ignoreTags - ignores singleton tag", () => {
  equal(
    stripHtml("Some text <hr> some more <i>text</i>.", {
      ignoreTags: ["hr"],
    }).result,
    "Some text <hr> some more text.",
    "013.01",
  );
});

test("014 - opts.ignoreTags - ignores singleton tag, XHTML", () => {
  equal(
    stripHtml("Some text <hr/> some more <i>text</i>.", {
      ignoreTags: ["hr"],
    }).result,
    "Some text <hr/> some more text.",
    "014.01",
  );
});

test("015 - opts.ignoreTags - ignores singleton tag, spaced XHTML", () => {
  equal(
    stripHtml("Some text <hr / > some more <i>text</i>.", {
      ignoreTags: ["hr"],
    }).result,
    "Some text <hr / > some more text.",
    "015.01",
  );
});

test("016 - opts.ignoreTags - ignores single zzz tag", () => {
  equal(
    stripHtml("Some <zzz>text</zzz> and some more <i>text</i>.", {
      ignoreTags: ["zzz"],
    }).result,
    "Some <zzz>text</zzz> and some more text.",
    "016.01",
  );
});

test("017 - opts.ignoreTags - ignores zzz singleton tag", () => {
  equal(
    stripHtml("Some text <zzz> some more <i>text</i>.", {
      ignoreTags: ["zzz"],
    }).result,
    "Some text <zzz> some more text.",
    "017.01",
  );
});

test("018 - opts.ignoreTags - ignores default ranged tag", () => {
  equal(
    stripHtml("Some <script>text</script> and some more <i>text</i>.", {
      ignoreTags: ["script"],
    }).result,
    "Some <script>text</script> and some more text.",
    "018.01",
  );
});

test("019 - opts.ignoreTags - ignored tag unclosed, ending with EOF", () => {
  // just for kicks:
  equal(
    stripHtml("Some <b>text</b", {
      ignoreTags: ["b"],
    }).result,
    "Some <b>text</b",
    "019.01",
  );
});

test("020 - opts.ignoreTags - recognised unclosed singleton tag, HTML", () => {
  equal(
    stripHtml("Some text <hr", {
      ignoreTags: ["hr"],
    }).result,
    "Some text <hr",
    "020.01",
  );
});

test("021 - opts.ignoreTags - recognised unclosed singleton tag, XHTML", () => {
  equal(
    stripHtml("Some text <hr/", {
      ignoreTags: ["hr"],
    }).result,
    "Some text <hr/",
    "021.01",
  );
});

test("022 - opts.ignoreTags - kept the tag and the slash, just trimmed", () => {
  equal(
    stripHtml("Some text <hr / ", {
      ignoreTags: ["hr"],
    }).result,
    "Some text <hr /",
    "022.01",
  );
});

test("023 - opts.ignoreTags - ignores unclosed self-closing zzz tag", () => {
  equal(
    stripHtml("Some <zzz>text</zzz", {
      ignoreTags: ["zzz"],
    }).result,
    "Some <zzz>text</zzz",
    "023.01",
  );
});

test("024 - opts.ignoreTags - ignores unclosed zzz singleton tag", () => {
  equal(
    stripHtml("Some text <zzz", {
      ignoreTags: ["zzz"],
    }).result,
    "Some text <zzz",
    "024.01",
  );
});

test("025 - opts.ignoreTags - ignores default unclosed ranged tag", () => {
  equal(
    stripHtml("Some <script>text</script", {
      ignoreTags: ["script"],
    }).result,
    "Some <script>text</script",
    "025.01",
  );
});

test("026 - opts.ignoreTags - throws because of wrong type", () => {
  throws(
    () => {
      stripHtml("<a>", {
        ignoreTags: 1,
      });
    },
    /THROW_ID_08/,
    "26.01",
  );
});

test("027 - custom tags, no attrs", () => {
  equal(
    stripHtml("a<MyTag />b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a<MyTag />b c",
    "027.01",
  );
  equal(
    stripHtml("a<MyTag/>b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a<MyTag/>b c",
    "027.02",
  );
  equal(
    stripHtml("a<MyTag >b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a<MyTag >b c",
    "027.03",
  );
  equal(
    stripHtml("a<MyTag>b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a<MyTag>b c",
    "027.04",
  );
  equal(
    stripHtml("a</MyTag>b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a</MyTag>b c",
    "027.05",
  );
  equal(
    stripHtml("a</MyTag/>b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a</MyTag/>b c",
    "027.06",
  );
});

test("028 - custom tags, with attrs", () => {
  equal(
    stripHtml("a<MyTag zzz />b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a<MyTag zzz />b c",
    "028.01",
  );
  equal(
    stripHtml("a<MyTag zzz/>b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a<MyTag zzz/>b c",
    "028.02",
  );
  equal(
    stripHtml("a<MyTag zzz >b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a<MyTag zzz >b c",
    "028.03",
  );
  equal(
    stripHtml("a<MyTag zzz>b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a<MyTag zzz>b c",
    "028.04",
  );
  equal(
    stripHtml("a</MyTag zzz>b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a</MyTag zzz>b c",
    "028.05",
  );
  equal(
    stripHtml("a</MyTag zzz/>b <div>c</div>", {
      ignoreTags: ["MyTag"],
    }).result,
    "a</MyTag zzz/>b c",
    "028.06",
  );
});

test("029 - custom tags, with proper attrs", () => {
  equal(
    stripHtml('a<MyTag class="z" />b <div>c</div>', {
      ignoreTags: ["MyTag"],
    }).result,
    'a<MyTag class="z" />b c',
    "029.01",
  );
  equal(
    stripHtml('a<MyTag class="z"/>b <div>c</div>', {
      ignoreTags: ["MyTag"],
    }).result,
    'a<MyTag class="z"/>b c',
    "029.02",
  );
  equal(
    stripHtml('a<MyTag class="z" >b <div>c</div>', {
      ignoreTags: ["MyTag"],
    }).result,
    'a<MyTag class="z" >b c',
    "029.03",
  );
  equal(
    stripHtml('a<MyTag class="z">b <div>c</div>', {
      ignoreTags: ["MyTag"],
    }).result,
    'a<MyTag class="z">b c',
    "029.04",
  );
  equal(
    stripHtml('a</MyTag class="z">b <div>c</div>', {
      ignoreTags: ["MyTag"],
    }).result,
    'a</MyTag class="z">b c',
    "029.05",
  );
  equal(
    stripHtml('a</MyTag class="z"/>b <div>c</div>', {
      ignoreTags: ["MyTag"],
    }).result,
    'a</MyTag class="z"/>b c',
    "029.06",
  );
});

test.run();
