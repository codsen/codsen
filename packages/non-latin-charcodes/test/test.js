import test from "ava";
import notLanguageCharCodes from "../dist/non-latin-charcodes.esm";
import rangesIsIndexWithin from "ranges-is-index-within";

test(`01 - array is set`, t => {
  t.true(Array.isArray(notLanguageCharCodes), "01");
});

test(`02 - second element is set too`, t => {
  t.deepEqual(notLanguageCharCodes[0], [880, 887], "02");
});

test(`03 - tap ranges-is-index-within`, t => {
  t.false(rangesIsIndexWithin(1, notLanguageCharCodes));

  // if one of ranges is [880, 887] - indexes on the edges are not included:

  t.false(rangesIsIndexWithin(880, notLanguageCharCodes));
  t.true(rangesIsIndexWithin(881, notLanguageCharCodes));

  t.true(rangesIsIndexWithin(886, notLanguageCharCodes));
  t.false(rangesIsIndexWithin(887, notLanguageCharCodes));
});

test(`04 - vanilla JS`, t => {
  const test1 = 880;
  t.false(
    notLanguageCharCodes.some(
      rangesArr => rangesArr[0] < test1 && rangesArr[1] > test1
    )
  );

  const test2 = 882;
  t.true(
    notLanguageCharCodes.some(
      rangesArr => rangesArr[0] < test2 && rangesArr[1] > test2
    )
  );
});

test(`05 - practical example`, t => {
  const charInGreek = "\u03A1";
  const charInRussian = "\u0420";
  const charInJapanese = "\u30ED";
  const charInChinese = "\u7F85";
  const charInHebrew = "\u05E8";
  const charInArabic = "\u0631";

  function encoder(character) {
    const charCode = character.charCodeAt(0);
    console.log(`---\nreceived: ${character} (charCode ${charCode})`);
    if (
      notLanguageCharCodes.some(
        rangesArr => rangesArr[0] < charCode && rangesArr[1] > charCode
      )
    ) {
      return `a non-latin letter`;
    }
    return `something else`;
  }

  // Don't encode characters from non-Latin languages:
  t.is(encoder(charInGreek), "a non-latin letter");
  t.is(encoder(charInRussian), "a non-latin letter");
  t.is(encoder(charInJapanese), "a non-latin letter");
  t.is(encoder(charInChinese), "a non-latin letter");
  t.is(encoder(charInHebrew), "a non-latin letter");
  t.is(encoder(charInArabic), "a non-latin letter");
});
