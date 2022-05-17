import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { extract, version } from "../dist/extract-search-index.esm.js";

// API / Throws
// -------------------------------------------------------------------

test("00 - exports a version", () => {
  ok(/\d+\.\d+\.\d+/.test(version));
});

test("01 - wrong/missing input = throw", () => {
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

test("02 - empty str input", () => {
  equal(extract(""), "", "02");
});

test("03 - whitespace only", () => {
  equal(extract("\n \n \r \r"), "", "03");
});

test("04 - one word", () => {
  equal(extract("zzz"), "zzz", "04");
});

test("05 - two words", () => {
  equal(extract("zzz yyy"), "zzz yyy", "05");
});

test("06 - two of the same", () => {
  equal(extract(" zzz \n zzz"), "zzz", "06");
});

test("07 - tackles emoji", () => {
  equal(extract("the quick brown fox 🦊"), "quick brown fox", "07");
});

test("08 - tackles stray astral characters", () => {
  equal(extract("Lazy\uD800lazy\uD83Ddog!\uDBFF"), "lazy dog", "08");
});

test("09 - tackles pair surrogates", () => {
  equal(extract("abc \uD83D\uDE0A def"), "abc def", "09");
});

test("10 - strips URL's (raw text)", () => {
  equal(extract("visit https://www.bbc.co.uk"), "visit", "10");
});

test("11 - strips URL's (markdown)", () => {
  equal(extract("[visit](https://www.bbc.co.uk)"), "visit", "11");
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
