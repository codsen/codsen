import { test } from "uvu";
import { equal } from "uvu/assert";

import { extract } from "../dist/extract-search-index.esm.js";

test("01 - literal and numeric emoji spellings separate neighboring words", () => {
  equal(extract("alpha😊beta"), "alpha beta", "01.01");
  equal(extract("alpha&#128522;beta"), "alpha beta", "01.02");
  equal(extract("alpha&#x1F60A;beta"), "alpha beta", "01.03");
});

test("02 - nested references receive the same final character cleanup", () => {
  equal(extract("alpha&amp;#128522;beta"), "alpha beta", "02.01");
  equal(extract("alpha&amp;amp;#x1F60A;beta"), "alpha beta", "02.02");
});

test("03 - repeated emoji leave no searchable tokens", () => {
  equal(extract("😊😊"), "", "03.01");
  equal(extract("&#128522;&#x1F60A;"), "", "03.02");
  equal(extract("&amp;#128522;&amp;amp;#x1F60A;"), "", "03.03");
});

test("04 - decoded separators preserve keyword order and deduplication", () => {
  equal(
    extract("Alpha😊beta ALPHA&#128522;beta Gamma&amp;#x1F60A;BETA"),
    "alpha beta gamma",
    "04.01",
  );
  equal(extract("word&#x1F60A;word"), "word", "04.02");
});

test("05 - supplementary letters retain the existing removal policy", () => {
  equal(extract("alpha𐐀beta"), "alpha beta", "05.01");
  equal(extract("alpha&#66560;beta"), "alpha beta", "05.02");
  equal(extract("alpha&#x10400;beta"), "alpha beta", "05.03");
  equal(extract("alpha&amp;amp;#x10400;beta"), "alpha beta", "05.04");
});

test("06 - literal lone surrogates remain separators", () => {
  equal(extract("alpha\uD800beta"), "alpha beta", "06.01");
  equal(extract("alpha\uDFFFbeta"), "alpha beta", "06.02");
});

test("07 - invalid numeric surrogate references recover to replacement characters", () => {
  equal(extract("alpha&#55296;beta"), "alpha\uFFFDbeta", "07.01");
  equal(extract("alpha&#xD800;beta"), "alpha\uFFFDbeta", "07.02");
  equal(extract("alpha&amp;amp;#xDFFF;beta"), "alpha\uFFFDbeta", "07.03");
  equal(extract("alpha\uFFFDbeta"), "alpha\uFFFDbeta", "07.04");
  equal(extract("alpha&#xD83D;&#xDE0A;beta"), "alpha\uFFFD\uFFFDbeta", "07.05");
});

test("08 - fullwidth spellings preserve letters and deduplicate", () => {
  equal(
    extract(
      "ＦＯＯ &#65318;&#65327;&#65327; &#xFF26;&#xFF2F;&#xFF2F; &amp;#xFF26;&amp;#xFF2F;&amp;#xFF2F;",
    ),
    "ｆｏｏ",
    "08.01",
  );
});

test("09 - high BMP and CJK characters survive every reference spelling", () => {
  equal(
    extract("alpha\uD7FFbeta alpha&#55295;beta alpha&#xD7FF;beta"),
    "alpha\uD7FFbeta",
    "09.01",
  );
  equal(
    extract("alpha\uE000beta alpha&#57344;beta alpha&#xE000;beta"),
    "alpha\uE000beta",
    "09.02",
  );
  equal(
    extract("中文 &#20013;&#25991; &#x4E2D;&#x6587; &amp;#x4E2D;&amp;#x6587;"),
    "中文",
    "09.03",
  );
});

test("10 - BMP hearts and variation selectors remain part of their words", () => {
  equal(
    extract(
      "alpha❤\uFE0Fbeta alpha&#10084;&#65039;beta alpha&#x2764;&#xFE0F;beta",
    ),
    "alpha❤\uFE0Fbeta",
    "10.01",
  );
  equal(
    extract("alpha♥beta alpha&hearts;beta alpha&amp;hearts;beta"),
    "alpha♥beta",
    "10.02",
  );
});

test("11 - joiners retain their existing BMP treatment", () => {
  equal(
    extract("alpha\u200Dbeta alpha&#8205;beta alpha&#x200D;beta"),
    "alpha\u200Dbeta",
    "11.01",
  );
});

test("12 - literal and encoded supplementary URL paths are removed as complete spans", () => {
  equal(
    extract("Read https://example.com/😊private manual"),
    "read manual",
    "12.01",
  );
  equal(
    extract("Read https://example.com/&#128522;private manual"),
    "read manual",
    "12.02",
  );
  equal(
    extract("Read https://example.com/&amp;#x1F60A;private manual"),
    "read manual",
    "12.03",
  );
  equal(
    extract("Read https://example.com/𐐀private manual"),
    "read manual",
    "12.04",
  );
});

test("13 - literal and encoded supplementary URL hosts are removed as complete spans", () => {
  equal(
    extract("Read https://😊.example/private manual"),
    "read manual",
    "13.01",
  );
  equal(
    extract("Read https://&#128522;.example/private manual"),
    "read manual",
    "13.02",
  );
  equal(
    extract("Read https://&amp;amp;#x1F60A;.example/private manual"),
    "read manual",
    "13.03",
  );
  equal(
    extract("Read https://𐐀.example/private manual"),
    "read manual",
    "13.04",
  );
  equal(
    extract("Read https://&#x10400;.example/private manual"),
    "read manual",
    "13.05",
  );
});

test.run();
