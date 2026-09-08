import { test } from "uvu";
import { equal } from "uvu/assert";

import { extract } from "../dist/extract-search-index.esm.js";

test("01 - BMP characters immediately below the surrogate range survive", () => {
  equal(
    extract("pre\uD7FApost pre\uD7FBpost pre\uD7FFpost"),
    "pre\uD7FApost pre\uD7FBpost pre\uD7FFpost",
    "01.01",
  );
});

test("02 - BMP private-use characters immediately after surrogates survive", () => {
  equal(
    extract("pre\uE000post pre\uE001post"),
    "pre\uE000post pre\uE001post",
    "02.01",
  );
});

test("03 - fullwidth letters retain their width and lowercase normally", () => {
  equal(extract("ＡＢＣ ＤＥＦ"), "ａｂｃ ｄｅｆ", "03.01");
});

test("04 - ordinary and canonically normalized CJK letters survive", () => {
  equal(extract("漢字 \uF900\uFA0E"), "漢字 \u8C48\uFA0E", "04.01");
});

test("05 - Arabic presentation letters survive without compatibility folding", () => {
  equal(
    extract("\uFE8D\uFE8E \uFB50\uFB51"),
    "\uFE8D\uFE8E \uFB50\uFB51",
    "05.01",
  );
});

test("06 - first occurrence order and lowercase deduplication are retained", () => {
  equal(
    extract("ＡＢ alpha ａｂ 漢字 ALPHA 漢字 ＣＤ"),
    "ａｂ alpha 漢字 ｃｄ",
    "06.01",
  );
});

test("07 - BMP replacement characters remain literal token content", () => {
  equal(extract("before\uFFFDafter"), "before\uFFFDafter", "07.01");
});

test("08 - lone high surrogates separate neighboring words", () => {
  equal(extract("alpha\uD800beta\uDBFFgamma"), "alpha beta gamma", "08.01");
});

test("09 - lone low surrogates separate neighboring words", () => {
  equal(extract("alpha\uDC00beta\uDFFFgamma"), "alpha beta gamma", "09.01");
});

test("10 - surrogate pairs retain the existing separator policy", () => {
  equal(extract("alpha😀beta\uD801\uDC00gamma"), "alpha beta gamma", "10.01");
});

test("11 - surrogate-only and edge-surrogate inputs do not add empty words", () => {
  equal(extract("\uD800\uDBFF\uDC00\uDFFF😀"), "", "11.01");
  equal(extract("\uD800alpha\uDFFF"), "alpha", "11.02");
});

test("12 - BMP heart symbols and variation selectors stay inside words", () => {
  equal(extract("ab❤cd ab❤️cd ab❤︎cd"), "ab❤cd ab❤️cd ab❤︎cd", "12.01");
});

test("13 - BMP joiners remain literal parts of retained words", () => {
  equal(extract("ab\u200Dcd ab\u200Ccd"), "ab\u200Dcd ab\u200Ccd", "13.01");
});

test("14 - text below the former cutoff keeps its existing normalization", () => {
  equal(extract("ΩΜ 中文 Café CAFÉ"), "ωμ 中文 café", "14.01");
});

test.run();
