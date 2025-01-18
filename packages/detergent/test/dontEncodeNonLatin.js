import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

test(`01 - ${`\u001b[${36}m${"opts.dontEncodeNonLatin"}\u001b[${39}m`} - doesn't encode non-Latin`, () => {
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
      JSON.stringify(opt, null, 0),
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

test.run();
