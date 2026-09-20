import { readFileSync } from "node:fs";
import { test } from "uvu";
import { equal } from "uvu/assert";

import { crush } from "../dist/html-crush.esm.js";

// Inputs and source provenance are maintained in ops/standards/.
// Expectations here belong to the html-crush transformation contract.
const cases = JSON.parse(
  readFileSync(
    new URL("./fixtures/standards/pilot.json", import.meta.url),
    "utf8",
  ),
);

test("01 - html-void-br preserves a void line-break tag", () => {
  equal(crush(cases["html-void-br"]).result, "<br>", "01.01");
});

test("02 - html-void-wbr preserves a word-break opportunity", () => {
  equal(crush(cases["html-void-wbr"]).result, "one<wbr>two", "02.01");
});

test("03 - html-unquoted-solidus preserves the slash belonging to the unquoted value", () => {
  equal(
    crush(cases["html-unquoted-solidus"]).result,
    '<img alt="" src=x/>',
    "03.01",
  );
  equal(
    crush(cases["html-unquoted-solidus"], { removeLineBreaks: true }).result,
    '<img alt="" src=x/>',
    "03.02",
  );
});

test("04 - html-separated-solidus keeps the separator before a discarded slash", () => {
  equal(
    crush(cases["html-separated-solidus"]).result,
    '<img alt="" src=x />',
    "04.01",
  );
  equal(
    crush(cases["html-separated-solidus"], { removeLineBreaks: true }).result,
    '<img alt="" src=x />',
    "04.02",
  );
});

test("05 - html-double-quoted-greater-than preserves greater-than signs in double-quoted values", () => {
  equal(
    crush(cases["html-double-quoted-greater-than"]).result,
    '<p title="a > b">text</p>',
    "05.01",
  );
});

test("06 - html-single-quoted-greater-than preserves greater-than signs in single-quoted values", () => {
  equal(
    crush(cases["html-single-quoted-greater-than"]).result,
    "<p title='a > b'>text</p>",
    "06.01",
  );
});

test("07 - html-boolean-attribute preserves boolean attributes", () => {
  equal(
    crush(cases["html-boolean-attribute"]).result,
    "<input disabled>",
    "07.01",
  );
});

test("08 - html-ascii-case preserves ASCII tag and attribute casing", () => {
  equal(
    crush(cases["html-ascii-case"]).result,
    '<DIV TITLE="X">Text</DIV>',
    "08.01",
  );
});

test("09 - html-named-references preserves named character references", () => {
  equal(
    crush(cases["html-named-references"]).result,
    "<p>&copy; &amp; &NotEqualTilde;</p>",
    "09.01",
  );
});

test("10 - html-numeric-recovery preserves numeric references for the HTML parser", () => {
  equal(
    crush(cases["html-numeric-recovery"]).result,
    "<p>&#65; &#x1F680; &#0;</p>",
    "10.01",
  );
});

test("11 - html-reference-context preserves attribute and text reference contexts", () => {
  equal(
    crush(cases["html-reference-context"]).result,
    '<p title="&notit; &amp;">&notit;</p>',
    "11.01",
  );
});

test("12 - html-textarea-rcdata preserves literal markup in textarea RCDATA", () => {
  equal(
    crush(cases["html-textarea-rcdata"]).result,
    "<textarea><b>&amp;</b></textarea>",
    "12.01",
  );
});

test("13 - html-title-rcdata preserves title RCDATA", () => {
  equal(
    crush(cases["html-title-rcdata"]).result,
    "<title>one &amp; two</title>",
    "13.01",
  );
});

test("14 - html-comments removes real comments only when requested", () => {
  equal(
    crush(cases["html-comments"]).result,
    "<p>A<!-- note -->B</p>",
    "14.01",
  );
  equal(
    crush(cases["html-comments"], { removeHTMLComments: true }).result,
    "<p>AB</p>",
    "14.02",
  );
});

test("15 - html-doctype preserves the doctype", () => {
  equal(
    crush(cases["html-doctype"]).result,
    "<!doctype html><p>text</p>",
    "15.01",
  );
});

test("16 - html-optional-end-tags preserves optional end tags", () => {
  equal(
    crush(cases["html-optional-end-tags"]).result,
    "<ul><li>one<li>two</ul>",
    "16.01",
  );
});

test("17 - html-foreign-self-close preserves foreign self-closing syntax", () => {
  equal(
    crush(cases["html-foreign-self-close"]).result,
    '<svg><path d="M0 0" /></svg>',
    "17.01",
  );
});

test("18 - html-unquoted-class-solidus preserves matching slash-bearing CSS and HTML class names", () => {
  equal(
    crush(cases["html-unquoted-class-solidus"]).result,
    '<style>.used\\/{color:red}</style><img alt="" class=used/>',
    "18.01",
  );
  equal(
    crush(cases["html-unquoted-class-solidus"], {
      removeLineBreaks: true,
      breakToTheLeftOf: [],
    }).result,
    '<style>.used\\/{color:red}</style><img alt="" class=used/>',
    "18.02",
  );
});

test("19 - css-comments removes CSS comments while retaining both rules", () => {
  equal(
    crush(cases["css-comments"]).result,
    '<style>.used{color:red}.gone{color:blue}</style><p class="used">text</p>',
    "19.01",
  );
  equal(
    crush(cases["css-comments"], { removeCSSComments: false }).result,
    '<style>.used{/* note */color:red}.gone{color:blue}</style><p class="used">text</p>',
    "19.02",
  );
});

test("20 - css-hex-escape preserves the CSS hex escape terminator", () => {
  equal(
    crush(cases["css-hex-escape"]).result,
    '<style>.\\31 23{color:red}</style><p class="123">text</p>',
    "20.01",
  );
});

test("21 - css-escaped-punctuation preserves escaped selector punctuation", () => {
  equal(
    crush(cases["css-escaped-punctuation"]).result,
    '<style>.a\\+b{color:red}</style><p class="a+b">text</p>',
    "21.01",
  );
});

test("22 - css-string-delimiters preserves literal delimiters inside CSS strings", () => {
  equal(
    crush(cases["css-string-delimiters"]).result,
    '<style>.used::before{content:"a; } /* b */"}</style><p class="used">text</p>',
    "22.01",
  );
});

test("23 - css-url-delimiters preserves delimiters inside CSS URLs", () => {
  equal(
    crush(cases["css-url-delimiters"]).result,
    '<style>.used{background:url("https://example.test/a;b#c")}</style><p class="used">text</p>',
    "23.01",
  );
});

test("24 - css-attribute-selector preserves commas inside attribute selectors", () => {
  equal(
    crush(cases["css-attribute-selector"]).result,
    '<style>.used[data-x="a,b"]{color:red}</style><p class="used" data-x="a,b">text</p>',
    "24.01",
  );
});

test("25 - css-is-selector preserves functional selector alternatives", () => {
  equal(
    crush(cases["css-is-selector"]).result,
    '<style>:is(.used,.gone){color:red}</style><p class="used">text</p>',
    "25.01",
  );
});

test("26 - css-not-selector preserves negation selectors", () => {
  equal(
    crush(cases["css-not-selector"]).result,
    '<style>.used:not(.gone){color:red}</style><p class="used">text</p>',
    "26.01",
  );
});

test("27 - css-nested-conditional preserves nested conditional rules", () => {
  equal(
    crush(cases["css-nested-conditional"]).result,
    '<style>@media screen{@supports (display:grid){.used{display:grid}.gone{color:red}}}</style><p class="used">text</p>',
    "27.01",
  );
});

test("28 - css-custom-properties preserves custom-property tokens", () => {
  equal(
    crush(cases["css-custom-properties"]).result,
    '<style>:root{--accent:red;--tokens:a b}.used{color:var(--accent)}</style><p class="used">text</p>',
    "28.01",
  );
});

test("29 - css-nesting preserves nesting and its descendant combinator", () => {
  equal(
    crush(cases["css-nesting"]).result,
    '<style>.used{color:red;& .child{color:blue}}</style><div class="used"><span class="child">text</span></div>',
    "29.01",
  );
});

test("30 - css-font-face preserves font-face rules and string contents", () => {
  equal(
    crush(cases["css-font-face"]).result,
    '<style>@font-face{font-family:"A; B";src:url("font.woff2")}.used{font-family:"A; B"}</style><p class="used">text</p>',
    "30.01",
  );
});

test("31 - js-template-lines preserves JavaScript template line terminators", () => {
  equal(
    crush(cases["js-template-lines"]).result,
    "<script>const x = `one\n\n  two`;</script><p>text</p>",
    "31.01",
  );
  equal(
    crush(cases["js-template-lines"], {
      removeLineBreaks: true,
      removeHTMLComments: true,
    }).result,
    "<script>const x = `one\n\n  two`;</script><p>text</p>",
    "31.02",
  );
});

test("32 - js-regexp preserves JavaScript regular-expression syntax", () => {
  equal(
    crush(cases["js-regexp"]).result,
    "<script>const pattern = /<[a-z]+>/gi;</script><p>text</p>",
    "32.01",
  );
  equal(
    crush(cases["js-regexp"], {
      removeLineBreaks: true,
      removeHTMLComments: true,
    }).result,
    "<script>const pattern = /<[a-z]+>/gi;</script><p>text</p>",
    "32.02",
  );
});

test("33 - js-line-comment preserves the newline after a JavaScript line comment", () => {
  equal(
    crush(cases["js-line-comment"]).result,
    "<script>// <b>literal</b>\nconst x = 1;</script><p>text</p>",
    "33.01",
  );
  equal(
    crush(cases["js-line-comment"], {
      removeLineBreaks: true,
      removeHTMLComments: true,
    }).result,
    "<script>// <b>literal</b>\nconst x = 1;</script><p>text</p>",
    "33.02",
  );
});

test("34 - js-html-like-string preserves HTML-like JavaScript string data", () => {
  equal(
    crush(cases["js-html-like-string"]).result,
    '<script>const x = "<!-- literal -->";</script><p>text</p>',
    "34.01",
  );
  equal(
    crush(cases["js-html-like-string"], {
      removeLineBreaks: true,
      removeHTMLComments: true,
    }).result,
    '<script>const x = "<!-- literal -->";</script><p>text</p>',
    "34.02",
  );
});

test("35 - js-modern-operators preserves module scripts and modern operator syntax", () => {
  equal(
    crush(cases["js-modern-operators"]).result,
    '<script type="module">const x = data?.value ?? "fallback";</script><p>text</p>',
    "35.01",
  );
  equal(
    crush(cases["js-modern-operators"], {
      removeLineBreaks: true,
      removeHTMLComments: true,
    }).result,
    '<script type="module">const x = data?.value ?? "fallback";</script><p>text</p>',
    "35.02",
  );
});

test("36 - js-end-tag-prefix ignores script end-tag prefixes in JavaScript strings", () => {
  equal(
    crush(cases["js-end-tag-prefix"]).result,
    '<script>const x = "</scriptx>";</script><p>text</p>',
    "36.01",
  );
  equal(
    crush(cases["js-end-tag-prefix"], {
      removeLineBreaks: true,
      removeHTMLComments: true,
    }).result,
    '<script>const x = "</scriptx>";</script><p>text</p>',
    "36.02",
  );
});

test.run();
