import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { extract, version } from "../dist/extract-search-index.esm.js";

// API / Throws
// -------------------------------------------------------------------

test("01 - exports a version", () => {
  ok(/\d+\.\d+\.\d+/.test(version), "01.01");
});

test("02 - wrong/missing input = throw", () => {
  throws(() => {
    extract();
  }, /THROW_ID_01/g);
  throws(() => {
    extract(1);
  }, /THROW_ID_01/g);
  throws(() => {
    extract(null);
  }, /THROW_ID_01/g);
  throws(() => {
    extract(undefined);
  }, /THROW_ID_01/g);
  throws(() => {
    extract(true);
  }, /THROW_ID_01/g);
});

// Normal use
// -------------------------------------------------------------------

test("03 - empty str input", () => {
  equal(extract(""), "", "03.01");
});

test("04 - whitespace only", () => {
  equal(extract("\n \n \r \r"), "", "04.01");
});

test("05 - one word", () => {
  equal(extract("zzz"), "zzz", "05.01");
});

test("06 - two words", () => {
  equal(extract("zzz yyy"), "zzz yyy", "06.01");
});

test("07 - two of the same", () => {
  equal(extract(" zzz \n zzz"), "zzz", "07.01");
});

test("08 - tackles emoji", () => {
  equal(extract("the quick brown fox 🦊"), "quick brown fox", "08.01");
});

test("09 - tackles stray astral characters", () => {
  equal(extract("Lazy\uD800lazy\uD83Ddog!\uDBFF"), "lazy dog", "09.01");
});

test("10 - tackles pair surrogates", () => {
  equal(extract("abc \uD83D\uDE0A def"), "abc def", "10.01");
});

test("11 - strips URL's (raw text)", () => {
  equal(extract("visit https://www.bbc.co.uk"), "visit", "11.01");
});

test("12 - strips URL's (markdown)", () => {
  equal(extract("[visit](https://www.bbc.co.uk)"), "visit", "12.01");
});

// TODO - blocked by string-strip-html
// test("12 - tackles markdown quote blocks", () => {
//   equal(
//     extract(`
// > "To be or not to be?"
// > —Hamlet
//   `),
//     "tbc",
//     "12"
//   );
// });

test.run();
