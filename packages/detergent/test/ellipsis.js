// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import {
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  // rawNbsp,
  // hairspace,
  ellipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote,
} from "codsen-utils";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
// import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

// -----------------------------------------------------------------------------

test("001 - ellipsis - horizontal ellipsis sanity check - convert off - raw", () => {
  mixer({
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `${ellipsis}`, opt).res,
      "...",
      `001.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("002 - ellipsis - horizontal ellipsis sanity check - convert off - encoded", () => {
  mixer({
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&hellip;", opt).res,
      "...",
      `002.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("003 - ellipsis - horizontal ellipsis sanity check - convert off - wrongly encoded", () => {
  mixer({
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&mldr;", opt).res,
      "...",
      `003.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("004 - ellipsis - raw - encodes the ellipsis when it has to", () => {
  mixer({
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `${ellipsis}`, opt).res,
      "&hellip;",
      `004.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("005 - ellipsis - correctly encoded - converts", () => {
  mixer({
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&hellip;", opt).res,
      "&hellip;",
      `005.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("006 - ellipsis - wrongly encoded - convert on", () => {
  mixer({
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&mldr;", opt).res,
      "&hellip;",
      `006.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("007 - ellipsis - raw - siwtched off setting converts explicitly", () => {
  mixer({
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "...", opt).res,
      "...",
      `007.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("008 - ellipsis - raw - siwtched off setting converts explicitly", () => {
  mixer({
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "And then...", opt).res,
      "And then...",
      `008.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("009 - ellipsis - raw - siwtched off setting converts explicitly", () => {
  mixer({
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `${ellipsis}`, opt).res,
      "...",
      `009.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("010 - ellipsis - raw - siwtched off setting converts explicitly", () => {
  mixer({
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&hellip;", opt).res,
      "...",
      `010.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("011 - ellipsis - raw - siwtched off setting converts explicitly", () => {
  mixer({
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&mldr;", opt).res,
      "...",
      `011.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("012 - ellipsis - raw - convert off", () => {
  mixer({
    convertEntities: false,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `${ellipsis}`, opt).res,
      `${ellipsis}`,
      `012.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("013 - ellipsis - raw - convert off", () => {
  mixer({
    convertEntities: false,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&hellip;", opt).res,
      `${ellipsis}`,
      `013.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("014 - ellipsis - raw - convert off", () => {
  mixer({
    convertEntities: false,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&mldr;", opt).res,
      `${ellipsis}`,
      `014.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("015 - ellipsis - dots - convert off - three dots to unencoded hellip", () => {
  mixer({
    convertEntities: false,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "...", opt).res,
      `${ellipsis}`,
      `015.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("016 - ellipsis - dots - convert off - three dots to unencoded hellip", () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Aaaaa... Bbbbb... C...", opt).res,
      `Aaaaa${ellipsis} Bbbbb${ellipsis} C${ellipsis}`,
      `016.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("017 - ellipsis - dots - convert off - encoded hellip to unencoded hellip", () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&hellip;", opt).res,
      `${ellipsis}`,
      `017.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("018 - ellipsis - dots - convert off - encoded mldr to unencoded hellip", () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&mldr;", opt).res,
      `${ellipsis}`,
      `018.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("019 - ellipsis - dots - convert off - hexidecimal to unencoded hellip", () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&#x02026;", opt).res,
      `${ellipsis}`,
      `019.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("020 - ellipsis - dots - convert off - decimal to unencoded hellip", () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&#8230;", opt).res,
      `${ellipsis}`,
      `020.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("021 - ellipsis - dots - convert on - three dots to encoded hellip", () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "...", opt).res,
      "&hellip;",
      `021.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("022 - ellipsis - dots - convert on - three dots to encoded hellip", () => {
  mixer({
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Aaaaa... Bbbbb... C...", opt).res,
      "Aaaaa&hellip; Bbbbb&hellip; C&hellip;",
      `022.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("023 - ellipsis - dots - convert on - encoded hellip to encoded hellip", () => {
  mixer({
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&hellip;", opt).res,
      "&hellip;",
      `023.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("024 - ellipsis - dots - convert on - encoded mldr to encoded hellip", () => {
  mixer({
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&mldr;", opt).res,
      "&hellip;",
      `024.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("025 - ellipsis - dots - convert on - hexidecimal to encoded hellip", () => {
  mixer({
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&#x02026;", opt).res,
      "&hellip;",
      `025.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("026 - ellipsis - dots - convert on - decimal to encoded hellip", () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&#8230;", opt).res,
      "&hellip;",
      `026.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("027 - ellipsis - dots - convert on - unencoded to encoded", () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `${ellipsis}`, opt).res,
      "&hellip;",
      `027.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("028 - ellipsis - dots - convert off - three dots", () => {
  mixer({
    removeWidows: false,
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "...", opt).res,
      "...",
      `028.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("029 - ellipsis - dots - convert off - single letters", () => {
  mixer({
    removeWidows: false,
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Aaaaa... Bbbbb... C...", opt).res,
      "Aaaaa... Bbbbb... C...",
      `029.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("030 - ellipsis - dots - convert off - hellip entity", () => {
  mixer({
    removeWidows: false,
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&hellip;", opt).res,
      "...",
      `030.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("031 - ellipsis - dots - convert off - mldr entity", () => {
  mixer({
    removeWidows: false,
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&mldr;", opt).res,
      "...",
      `031.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("032 - ellipsis - dots - convert off - hex entity", () => {
  mixer({
    removeWidows: false,
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&#x02026;", opt).res,
      "...",
      `032.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("033 - ellipsis - dots - convert off - numeric entity", () => {
  mixer({
    removeWidows: false,
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&#8230;", opt).res,
      "...",
      `033.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("034 - ellipsis - ellipsis - long lines of many dots are not touched", () => {
  let source =
    "Chapter 01 ..................... page 21\nChapter 02 ..................... page 43";
  mixer({
    replaceLineBreaks: false,
    removeLineBreaks: false,
    removeWidows: false,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, source, opt).res,
      source,
      `034.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("035 - ellipsis - ellipsis - mix of false positives and a real deal", () => {
  mixer({
    replaceLineBreaks: false,
    removeLineBreaks: false,
    removeWidows: false,
    convertEntities: false,
    convertDotsToEllipsis: true, // <---------
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Chapter 01 ..................... page 21\nChapter 02 ..................... page 43\nI said so...",
        opt,
      ).res,
      `Chapter 01 ..................... page 21\nChapter 02 ..................... page 43\nI said so${ellipsis}`,
      `035.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
  mixer({
    replaceLineBreaks: false,
    removeLineBreaks: false,
    removeWidows: false,
    convertEntities: false,
    convertDotsToEllipsis: false, // <---------
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Chapter 01 ..................... page 21\nChapter 02 ..................... page 43\nI said so...",
        opt,
      ).res,
      "Chapter 01 ..................... page 21\nChapter 02 ..................... page 43\nI said so...",
      `035.02 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("036 - ellipsis - ellipsis - mix of dots", () => {
  mixer({
    replaceLineBreaks: false,
    removeLineBreaks: false,
    removeWidows: false,
    convertEntities: false,
    convertDotsToEllipsis: true, // <---------
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "..... ... . ..", opt).res,
      `..... ${ellipsis} . ..`,
      `036.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
  mixer({
    replaceLineBreaks: false,
    removeLineBreaks: false,
    removeWidows: false,
    convertEntities: false,
    convertDotsToEllipsis: false, // <---------
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "..... ... . ..", opt).res,
      "..... ... . ..",
      `036.02 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("037 - ellipsis - ellipsis - resembling real life", () => {
  let source = "Contents.......page 01";
  mixer({
    replaceLineBreaks: false,
    removeLineBreaks: false,
    removeWidows: false,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, source, opt).res,
      source,
      `037.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test.run();
