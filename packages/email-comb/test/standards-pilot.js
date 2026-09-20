import { readFileSync } from "node:fs";
import { test } from "uvu";
import { equal } from "uvu/assert";

import { comb } from "../dist/email-comb.esm.js";

// Inputs and provenance are maintained in ops/standards. Expectations belong
// to this package: preserve language content and remove only unused CSS.
const cases = JSON.parse(
  readFileSync(
    new URL("./fixtures/standards/pilot.json", import.meta.url),
    "utf8",
  ),
);

test("01 - html-void-br", () => {
  const actual = comb(cases["html-void-br"]);
  equal(actual.result, cases["html-void-br"], "01.01");
  equal(actual.allInHead, [], "01.02");
  equal(actual.allInBody, [], "01.03");
  equal(actual.deletedFromHead, [], "01.04");
  equal(actual.deletedFromBody, [], "01.05");
});

test("02 - html-void-wbr", () => {
  const actual = comb(cases["html-void-wbr"]);
  equal(actual.result, cases["html-void-wbr"], "02.01");
  equal(actual.allInHead, [], "02.02");
  equal(actual.allInBody, [], "02.03");
  equal(actual.deletedFromHead, [], "02.04");
  equal(actual.deletedFromBody, [], "02.05");
});

test("03 - html-unquoted-solidus", () => {
  const actual = comb(cases["html-unquoted-solidus"]);
  equal(actual.result, cases["html-unquoted-solidus"], "03.01");
  equal(actual.allInHead, [], "03.02");
  equal(actual.allInBody, [], "03.03");
  equal(actual.deletedFromHead, [], "03.04");
  equal(actual.deletedFromBody, [], "03.05");
});

test("04 - html-separated-solidus", () => {
  const actual = comb(cases["html-separated-solidus"]);
  equal(actual.result, cases["html-separated-solidus"], "04.01");
  equal(actual.allInHead, [], "04.02");
  equal(actual.allInBody, [], "04.03");
  equal(actual.deletedFromHead, [], "04.04");
  equal(actual.deletedFromBody, [], "04.05");
});

test("05 - html-double-quoted-greater-than", () => {
  const actual = comb(cases["html-double-quoted-greater-than"]);
  equal(actual.result, cases["html-double-quoted-greater-than"], "05.01");
  equal(actual.allInHead, [], "05.02");
  equal(actual.allInBody, [], "05.03");
  equal(actual.deletedFromHead, [], "05.04");
  equal(actual.deletedFromBody, [], "05.05");
});

test("06 - html-single-quoted-greater-than", () => {
  const actual = comb(cases["html-single-quoted-greater-than"]);
  equal(actual.result, cases["html-single-quoted-greater-than"], "06.01");
  equal(actual.allInHead, [], "06.02");
  equal(actual.allInBody, [], "06.03");
  equal(actual.deletedFromHead, [], "06.04");
  equal(actual.deletedFromBody, [], "06.05");
});

test("07 - html-boolean-attribute", () => {
  const actual = comb(cases["html-boolean-attribute"]);
  equal(actual.result, cases["html-boolean-attribute"], "07.01");
  equal(actual.allInHead, [], "07.02");
  equal(actual.allInBody, [], "07.03");
  equal(actual.deletedFromHead, [], "07.04");
  equal(actual.deletedFromBody, [], "07.05");
});

test("08 - html-ascii-case", () => {
  const actual = comb(cases["html-ascii-case"]);
  equal(actual.result, cases["html-ascii-case"], "08.01");
  equal(actual.allInHead, [], "08.02");
  equal(actual.allInBody, [], "08.03");
  equal(actual.deletedFromHead, [], "08.04");
  equal(actual.deletedFromBody, [], "08.05");
});

test("09 - html-named-references", () => {
  const actual = comb(cases["html-named-references"]);
  equal(actual.result, cases["html-named-references"], "09.01");
  equal(actual.allInHead, [], "09.02");
  equal(actual.allInBody, [], "09.03");
  equal(actual.deletedFromHead, [], "09.04");
  equal(actual.deletedFromBody, [], "09.05");
});

test("10 - html-numeric-recovery", () => {
  const actual = comb(cases["html-numeric-recovery"]);
  equal(actual.result, cases["html-numeric-recovery"], "10.01");
  equal(actual.allInHead, [], "10.02");
  equal(actual.allInBody, [], "10.03");
  equal(actual.deletedFromHead, [], "10.04");
  equal(actual.deletedFromBody, [], "10.05");
});

test("11 - html-reference-context", () => {
  const actual = comb(cases["html-reference-context"]);
  equal(actual.result, cases["html-reference-context"], "11.01");
  equal(actual.allInHead, [], "11.02");
  equal(actual.allInBody, [], "11.03");
  equal(actual.deletedFromHead, [], "11.04");
  equal(actual.deletedFromBody, [], "11.05");
});

test("12 - html-textarea-rcdata", () => {
  const actual = comb(cases["html-textarea-rcdata"]);
  equal(actual.result, cases["html-textarea-rcdata"], "12.01");
  equal(actual.allInHead, [], "12.02");
  equal(actual.allInBody, [], "12.03");
  equal(actual.deletedFromHead, [], "12.04");
  equal(actual.deletedFromBody, [], "12.05");
});

test("13 - html-title-rcdata", () => {
  const actual = comb(cases["html-title-rcdata"]);
  equal(actual.result, cases["html-title-rcdata"], "13.01");
  equal(actual.allInHead, [], "13.02");
  equal(actual.allInBody, [], "13.03");
  equal(actual.deletedFromHead, [], "13.04");
  equal(actual.deletedFromBody, [], "13.05");
});

test("14 - html-comments", () => {
  const actual = comb(cases["html-comments"]);
  // The established comment-removal policy inserts a text separator.
  equal(actual.result, "<p>A B</p>", "14.01");
  equal(actual.allInHead, [], "14.02");
  equal(actual.allInBody, [], "14.03");
  equal(actual.deletedFromHead, [], "14.04");
  equal(actual.deletedFromBody, [], "14.05");
  equal(
    comb(cases["html-comments"], { removeHTMLComments: false }).result,
    cases["html-comments"],
    "14.06",
  );
});

test("15 - html-doctype", () => {
  const actual = comb(cases["html-doctype"]);
  equal(actual.result, cases["html-doctype"], "15.01");
  equal(actual.allInHead, [], "15.02");
  equal(actual.allInBody, [], "15.03");
  equal(actual.deletedFromHead, [], "15.04");
  equal(actual.deletedFromBody, [], "15.05");
});

test("16 - html-optional-end-tags", () => {
  const actual = comb(cases["html-optional-end-tags"]);
  equal(actual.result, cases["html-optional-end-tags"], "16.01");
  equal(actual.allInHead, [], "16.02");
  equal(actual.allInBody, [], "16.03");
  equal(actual.deletedFromHead, [], "16.04");
  equal(actual.deletedFromBody, [], "16.05");
});

test("17 - html-foreign-self-close", () => {
  const actual = comb(cases["html-foreign-self-close"]);
  equal(actual.result, cases["html-foreign-self-close"], "17.01");
  equal(actual.allInHead, [], "17.02");
  equal(actual.allInBody, [], "17.03");
  equal(actual.deletedFromHead, [], "17.04");
  equal(actual.deletedFromBody, [], "17.05");
});

test("18 - html-unquoted-class-solidus", () => {
  const actual = comb(cases["html-unquoted-class-solidus"]);
  equal(actual.result, cases["html-unquoted-class-solidus"], "18.01");
  equal(actual.allInHead, [".used/"], "18.02");
  equal(actual.allInBody, [".used/"], "18.03");
  equal(actual.deletedFromHead, [], "18.04");
  equal(actual.deletedFromBody, [], "18.05");
});

test("19 - css-comments", () => {
  const actual = comb(cases["css-comments"]);
  equal(
    actual.result,
    '<style>.used{color:red}</style><p class="used">text</p>',
    "19.01",
  );
  equal(actual.allInHead, [".gone", ".used"], "19.02");
  equal(actual.allInBody, [".used"], "19.03");
  equal(actual.deletedFromHead, [".gone"], "19.04");
  equal(actual.deletedFromBody, [], "19.05");
  equal(
    comb(cases["css-comments"], { removeCSSComments: false }).result,
    '<style>.used{/* note */color:red}</style><p class="used">text</p>',
    "19.06",
  );
});

test("20 - css-hex-escape", () => {
  const actual = comb(cases["css-hex-escape"]);
  equal(actual.result, cases["css-hex-escape"], "20.01");
  equal(actual.allInHead, [".123"], "20.02");
  equal(actual.allInBody, [".123"], "20.03");
  equal(actual.deletedFromHead, [], "20.04");
  equal(actual.deletedFromBody, [], "20.05");
});

test("21 - css-escaped-punctuation", () => {
  const actual = comb(cases["css-escaped-punctuation"]);
  equal(actual.result, cases["css-escaped-punctuation"], "21.01");
  equal(actual.allInHead, [".a+b"], "21.02");
  equal(actual.allInBody, [".a+b"], "21.03");
  equal(actual.deletedFromHead, [], "21.04");
  equal(actual.deletedFromBody, [], "21.05");
});

test("22 - css-string-delimiters", () => {
  const actual = comb(cases["css-string-delimiters"]);
  equal(actual.result, cases["css-string-delimiters"], "22.01");
  equal(actual.allInHead, [".used"], "22.02");
  equal(actual.allInBody, [".used"], "22.03");
  equal(actual.deletedFromHead, [], "22.04");
  equal(actual.deletedFromBody, [], "22.05");
});

test("23 - css-url-delimiters", () => {
  const actual = comb(cases["css-url-delimiters"]);
  equal(actual.result, cases["css-url-delimiters"], "23.01");
  equal(actual.allInHead, [".used"], "23.02");
  equal(actual.allInBody, [".used"], "23.03");
  equal(actual.deletedFromHead, [], "23.04");
  equal(actual.deletedFromBody, [], "23.05");
});

test("24 - css-attribute-selector", () => {
  const actual = comb(cases["css-attribute-selector"]);
  equal(actual.result, cases["css-attribute-selector"], "24.01");
  equal(actual.allInHead, [".used"], "24.02");
  equal(actual.allInBody, [".used"], "24.03");
  equal(actual.deletedFromHead, [], "24.04");
  equal(actual.deletedFromBody, [], "24.05");
});

test("25 - css-is-selector", () => {
  const actual = comb(cases["css-is-selector"]);
  // Keep functional selectors conservatively; a flat inventory cannot match them.
  equal(actual.result, cases["css-is-selector"], "25.01");
  equal(actual.allInHead, [".gone", ".used"], "25.02");
  equal(actual.allInBody, [".used"], "25.03");
  equal(actual.deletedFromHead, [], "25.04");
  equal(actual.deletedFromBody, [], "25.05");
});

test("26 - css-not-selector", () => {
  const actual = comb(cases["css-not-selector"]);
  // Keep functional selectors conservatively; a flat inventory cannot match them.
  equal(actual.result, cases["css-not-selector"], "26.01");
  equal(actual.allInHead, [".gone", ".used"], "26.02");
  equal(actual.allInBody, [".used"], "26.03");
  equal(actual.deletedFromHead, [], "26.04");
  equal(actual.deletedFromBody, [], "26.05");
});

test("27 - css-nested-conditional", () => {
  const actual = comb(cases["css-nested-conditional"]);
  equal(
    actual.result,
    '<style>@media screen{@supports (display:grid){.used{display:grid}}}</style><p class="used">text</p>',
    "27.01",
  );
  equal(actual.allInHead, [".gone", ".used"], "27.02");
  equal(actual.allInBody, [".used"], "27.03");
  equal(actual.deletedFromHead, [".gone"], "27.04");
  equal(actual.deletedFromBody, [], "27.05");
});

test("28 - css-custom-properties", () => {
  const actual = comb(cases["css-custom-properties"]);
  equal(actual.result, cases["css-custom-properties"], "28.01");
  equal(actual.allInHead, [".used"], "28.02");
  equal(actual.allInBody, [".used"], "28.03");
  equal(actual.deletedFromHead, [], "28.04");
  equal(actual.deletedFromBody, [], "28.05");
});

test("29 - css-nesting", () => {
  const actual = comb(cases["css-nesting"]);
  equal(actual.result, cases["css-nesting"], "29.01");
  equal(actual.allInHead, [".child", ".used"], "29.02");
  equal(actual.allInBody, [".child", ".used"], "29.03");
  equal(actual.deletedFromHead, [], "29.04");
  equal(actual.deletedFromBody, [], "29.05");
});

test("30 - css-font-face", () => {
  const actual = comb(cases["css-font-face"]);
  equal(actual.result, cases["css-font-face"], "30.01");
  equal(actual.allInHead, [".used"], "30.02");
  equal(actual.allInBody, [".used"], "30.03");
  equal(actual.deletedFromHead, [], "30.04");
  equal(actual.deletedFromBody, [], "30.05");
});

test("31 - js-template-lines", () => {
  const actual = comb(cases["js-template-lines"]);
  equal(actual.result, cases["js-template-lines"], "31.01");
  equal(actual.allInHead, [], "31.02");
  equal(actual.allInBody, [], "31.03");
  equal(actual.deletedFromHead, [], "31.04");
  equal(actual.deletedFromBody, [], "31.05");
});

test("32 - js-regexp", () => {
  const actual = comb(cases["js-regexp"]);
  equal(actual.result, cases["js-regexp"], "32.01");
  equal(actual.allInHead, [], "32.02");
  equal(actual.allInBody, [], "32.03");
  equal(actual.deletedFromHead, [], "32.04");
  equal(actual.deletedFromBody, [], "32.05");
});

test("33 - js-line-comment", () => {
  const actual = comb(cases["js-line-comment"]);
  equal(actual.result, cases["js-line-comment"], "33.01");
  equal(actual.allInHead, [], "33.02");
  equal(actual.allInBody, [], "33.03");
  equal(actual.deletedFromHead, [], "33.04");
  equal(actual.deletedFromBody, [], "33.05");
});

test("34 - js-html-like-string", () => {
  const actual = comb(cases["js-html-like-string"]);
  equal(actual.result, cases["js-html-like-string"], "34.01");
  equal(actual.allInHead, [], "34.02");
  equal(actual.allInBody, [], "34.03");
  equal(actual.deletedFromHead, [], "34.04");
  equal(actual.deletedFromBody, [], "34.05");
});

test("35 - js-modern-operators", () => {
  const actual = comb(cases["js-modern-operators"]);
  equal(actual.result, cases["js-modern-operators"], "35.01");
  equal(actual.allInHead, [], "35.02");
  equal(actual.allInBody, [], "35.03");
  equal(actual.deletedFromHead, [], "35.04");
  equal(actual.deletedFromBody, [], "35.05");
});

test("36 - js-end-tag-prefix", () => {
  const actual = comb(cases["js-end-tag-prefix"]);
  equal(actual.result, cases["js-end-tag-prefix"], "36.01");
  equal(actual.allInHead, [], "36.02");
  equal(actual.allInBody, [], "36.03");
  equal(actual.deletedFromHead, [], "36.04");
  equal(actual.deletedFromBody, [], "36.05");
});

test.run();
