import { test } from "uvu";
import { equal } from "uvu/assert";

import { extract } from "../dist/extract-search-index.esm.js";

test("01 - canonically equivalent Greek words retain the initial letter", () => {
  equal(extract("ἀρχή"), "ἀρχή", "01.01");
  equal(extract("α\u0313ρχή"), "ἀρχή", "01.02");
  equal(extract("ἀρχή α\u0313ρχή"), "ἀρχή", "01.03");
});

test("02 - composed and decomposed Latin words deduplicate after lowercasing", () => {
  equal(extract("café cafe\u0301 CAFÉ CAFE\u0301"), "café", "02.01");
});

test("03 - combining marks without a composed form remain in their words", () => {
  equal(
    extract("q\u0312word q\u0313word q\u0314word q\u0315word"),
    "q\u0312word q\u0313word q\u0314word q\u0315word",
    "03.01",
  );
});

test("04 - literal and encoded combining marks normalize together", () => {
  equal(
    extract("ἀρχή α&#787;ρχή α&#x313;ρχή α&amp;amp;#x313;ρχή"),
    "ἀρχή",
    "04.01",
  );
  equal(
    extract("café cafe&#769; cafe&#x301; cafe&amp;#x301;"),
    "café",
    "04.02",
  );
  equal(
    extract("q\u0313word q&#787;word q&#x313;word Q&amp;amp;#x313;word"),
    "q\u0313word",
    "04.03",
  );
});

test("05 - canonical mark ordering occurs before typography conversion", () => {
  equal(extract("a\u0315\u0300b à\u0315b"), "à\u0315b", "05.01");
  equal(extract("A&#789;&#768;b à&#x315;b"), "à\u0315b", "05.02");
});

test("06 - normalization after lowercasing composes newly available Greek forms", () => {
  equal(extract("Ϊ\u0301διο ΐδιο"), "ΐδιο", "06.01");
  equal(extract("&#938;&#769;διο &#x390;διο"), "ΐδιο", "06.02");
});

test("07 - canonically equivalent spacing marks receive the same typography mapping", () => {
  equal(extract("ab\u0374cd ab\u02B9cd"), "ab cd", "07.01");
  equal(extract("ab&#884;cd ab&#x2B9;cd"), "ab cd", "07.02");
});

test("08 - CJK characters with canonical decompositions use their canonical form", () => {
  equal(extract("foo\uF900bar foo\u8C48bar"), "foo\u8C48bar", "08.01");
  equal(extract("foo\uF901bar foo\u66F4bar"), "foo\u66F4bar", "08.02");
});

test("09 - compatibility-only width and ligature distinctions remain", () => {
  equal(extract("ＡＢ AB ａｂ ab"), "ａｂ ab", "09.01");
  equal(extract("ﬀoo ffoo"), "ﬀoo ffoo", "09.02");
});

test("10 - accents and ordinary lowercase distinctions are preserved", () => {
  equal(extract("café cafe"), "café cafe", "10.01");
  equal(extract("İstanbul istanbul"), "i\u0307stanbul istanbul", "10.02");
  equal(extract("Plain ALPHA alpha"), "plain alpha", "10.03");
});

test("11 - typography cleanup and canonical deduplication preserve word order", () => {
  equal(
    extract("…“cafe\u0301” ‘beta’ Café q\u0313word Q&#x313;WORD"),
    "café beta q\u0313word",
    "11.01",
  );
});

test("12 - original HTML attributes are discarded before canonical normalization", () => {
  equal(extract('<p title="α&#x313;private">α&#x313;ρχή</p>'), "ἀρχή", "12.01");
  equal(
    extract('<p title="cafe&#x301;private">cafe&#x301;</p> CAFÉ'),
    "café",
    "12.02",
  );
});

test.run();
