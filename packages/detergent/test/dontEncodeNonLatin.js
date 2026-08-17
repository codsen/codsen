// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

test("001 - opts.dontEncodeNonLatin - doesn't encode non-Latin", () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    dontEncodeNonLatin: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Greek: \u03A1\u03CC\u03B9\u03C3\u03C4\u03BF\u03BD \u03AE\u03C4\u03B1\u03BD \u03B5\u03B4\u03CE / Russian: \u0420\u043E\u0438\u0441\u0442\u043E\u043D / Japanese: \u30ED\u30A4\u30B9\u30C8\u30F3 / Chinese: \u7F85\u4F0A\u65AF\u9813 / Hebrew: \u05E8\u05D5\u05D9\u05E1\u05D8\u05D5\u05DF / Arabic: \u0631\u0648\u064A\u0633\u062A\u0648\u0646",
        opt,
      ).res,
      "Greek: \u03A1\u03CC\u03B9\u03C3\u03C4\u03BF\u03BD \u03AE\u03C4\u03B1\u03BD \u03B5\u03B4\u03CE / Russian: \u0420\u043E\u0438\u0441\u0442\u043E\u043D / Japanese: \u30ED\u30A4\u30B9\u30C8\u30F3 / Chinese: \u7F85\u4F0A\u65AF\u9813 / Hebrew: \u05E8\u05D5\u05D9\u05E1\u05D8\u05D5\u05DF / Arabic: \u0631\u0648\u064A\u0633\u062A\u0648\u0646",
      `001.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });

  compare(
    ok,
    det1(
      "Greek: \u03A1\u03CC\u03B9\u03C3\u03C4\u03BF\u03BD \u03AE\u03C4\u03B1\u03BD \u03B5\u03B4\u03CE / Russian: \u0420\u043E\u0438\u0441\u0442\u043E\u043D / Japanese: \u30ED\u30A4\u30B9\u30C8\u30F3 / Chinese: \u7F85\u4F0A\u65AF\u9813 / Hebrew: \u05E8\u05D5\u05D9\u05E1\u05D8\u05D5\u05DF / Arabic: \u0631\u0648\u064A\u0633\u062A\u0648\u0646",
      {
        removeWidows: false,
        dontEncodeNonLatin: true,
      },
    ),
    {
      res: "Greek: \u03A1\u03CC\u03B9\u03C3\u03C4\u03BF\u03BD \u03AE\u03C4\u03B1\u03BD \u03B5\u03B4\u03CE / Russian: \u0420\u043E\u0438\u0441\u0442\u043E\u043D / Japanese: \u30ED\u30A4\u30B9\u30C8\u30F3 / Chinese: \u7F85\u4F0A\u65AF\u9813 / Hebrew: \u05E8\u05D5\u05D9\u05E1\u05D8\u05D5\u05DF / Arabic: \u0631\u0648\u064A\u0633\u062A\u0648\u0646",
      applicableOpts: {
        fixBrokenEntities: false,
        removeWidows: true,
        convertEntities: false,
        convertDashes: false,
        convertApostrophes: false,
        replaceLineBreaks: false,
        removeLineBreaks: false,
        useXHTML: false,
        dontEncodeNonLatin: true,
        addMissingSpaces: false,
        convertDotsToEllipsis: false,
        stripHtml: false,
        eol: false,
      },
    },
    "01",
  );
});

test("002 - opts.dontEncodeNonLatin - astral characters", () => {
  // Array.from() splits by code point, so an astral character arrives as a
  // two-unit string; the check used to read charCodeAt(0), which is its high
  // surrogate. Every high surrogate sits inside one of the encode ranges, so
  // the option was decided by the surrogate rather than by the character.
  equal(
    det1("a\u{10400}b", { dontEncodeNonLatin: true }).res,
    "a\u{10400}b",
    "002.01",
  );
  equal(
    det1("a\u{20000}b", { dontEncodeNonLatin: true }).res,
    "a\u{20000}b",
    "002.02",
  );
  // with the option off they are encoded, so the option is what decides
  equal(
    det1("a\u{10400}b", { dontEncodeNonLatin: false }).res,
    "a&#x10400;b",
    "002.03",
  );
  equal(
    det1("a\u{20000}b", { dontEncodeNonLatin: false }).res,
    "a&#x20000;b",
    "002.04",
  );
  // the surrogate pair is never split, whichever way the option goes
  equal(
    [...det1("\u{10400}", { dontEncodeNonLatin: true }).res].length,
    1,
    "002.05",
  );
  // BMP behaviour is untouched
  equal(
    det1("a\u4E2Db", { dontEncodeNonLatin: true }).res,
    "a\u4E2Db",
    "002.06",
  );
  equal(det1("a<b", { dontEncodeNonLatin: true }).res, "a&lt;b", "002.07");
});

test.run();
