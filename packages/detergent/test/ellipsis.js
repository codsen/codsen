import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";
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

// -----------------------------------------------------------------------------

test(`01 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - horizontal ellipsis sanity check - convert off - raw`, () => {
  mixer({
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `${ellipsis}`, opt).res,
      "...",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`02 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - horizontal ellipsis sanity check - convert off - encoded`, () => {
  mixer({
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&hellip;", opt).res,
      "...",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`03 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - horizontal ellipsis sanity check - convert off - wrongly encoded`, () => {
  mixer({
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&mldr;", opt).res,
      "...",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`04 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - raw - encodes the ellipsis when it has to`, () => {
  mixer({
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `${ellipsis}`, opt).res,
      "&hellip;",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`05 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - correctly encoded - converts`, () => {
  mixer({
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&hellip;", opt).res,
      "&hellip;",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`06 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - wrongly encoded - convert on`, () => {
  mixer({
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&mldr;", opt).res,
      "&hellip;",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`07 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - raw - siwtched off setting converts explicitly`, () => {
  mixer({
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "...", opt).res, "...", JSON.stringify(opt, null, 4));
  });
});

test(`08 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - raw - siwtched off setting converts explicitly`, () => {
  mixer({
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "And then...", opt).res,
      "And then...",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`09 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - raw - siwtched off setting converts explicitly`, () => {
  mixer({
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `${ellipsis}`, opt).res,
      "...",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`10 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - raw - siwtched off setting converts explicitly`, () => {
  mixer({
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&hellip;", opt).res,
      "...",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`11 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - raw - siwtched off setting converts explicitly`, () => {
  mixer({
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&mldr;", opt).res,
      "...",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`12 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - raw - convert off`, () => {
  mixer({
    convertEntities: false,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `${ellipsis}`, opt).res,
      `${ellipsis}`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`13 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - raw - convert off`, () => {
  mixer({
    convertEntities: false,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&hellip;", opt).res,
      `${ellipsis}`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`14 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - raw - convert off`, () => {
  mixer({
    convertEntities: false,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&mldr;", opt).res,
      `${ellipsis}`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`15 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - dots - convert off - three dots to unencoded hellip`, () => {
  mixer({
    convertEntities: false,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "...", opt).res,
      `${ellipsis}`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`16 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - dots - convert off - three dots to unencoded hellip`, () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Aaaaa... Bbbbb... C...", opt).res,
      `Aaaaa${ellipsis} Bbbbb${ellipsis} C${ellipsis}`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`17 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - dots - convert off - encoded hellip to unencoded hellip`, () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&hellip;", opt).res,
      `${ellipsis}`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`18 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - dots - convert off - encoded mldr to unencoded hellip`, () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&mldr;", opt).res,
      `${ellipsis}`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`19 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - dots - convert off - hexidecimal to unencoded hellip`, () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&#x02026;", opt).res,
      `${ellipsis}`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`20 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - dots - convert off - decimal to unencoded hellip`, () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&#8230;", opt).res,
      `${ellipsis}`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`21 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - dots - convert on - three dots to encoded hellip`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "...", opt).res,
      "&hellip;",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`22 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - dots - convert on - three dots to encoded hellip`, () => {
  mixer({
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Aaaaa... Bbbbb... C...", opt).res,
      "Aaaaa&hellip; Bbbbb&hellip; C&hellip;",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`23 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - dots - convert on - encoded hellip to encoded hellip`, () => {
  mixer({
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&hellip;", opt).res,
      "&hellip;",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`24 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - dots - convert on - encoded mldr to encoded hellip`, () => {
  mixer({
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&mldr;", opt).res,
      "&hellip;",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`25 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - dots - convert on - hexidecimal to encoded hellip`, () => {
  mixer({
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&#x02026;", opt).res,
      "&hellip;",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`26 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - dots - convert on - decimal to encoded hellip`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&#8230;", opt).res,
      "&hellip;",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`27 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - dots - convert on - unencoded to encoded`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDotsToEllipsis: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `${ellipsis}`, opt).res,
      "&hellip;",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`28 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - dots - convert off - three dots`, () => {
  mixer({
    removeWidows: false,
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "...", opt).res, "...", JSON.stringify(opt, null, 4));
  });
});

test(`29 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - dots - convert off - single letters`, () => {
  mixer({
    removeWidows: false,
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Aaaaa... Bbbbb... C...", opt).res,
      "Aaaaa... Bbbbb... C...",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`30 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - dots - convert off - hellip entity`, () => {
  mixer({
    removeWidows: false,
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&hellip;", opt).res,
      "...",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`31 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - dots - convert off - mldr entity`, () => {
  mixer({
    removeWidows: false,
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&mldr;", opt).res,
      "...",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`32 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - dots - convert off - hex entity`, () => {
  mixer({
    removeWidows: false,
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&#x02026;", opt).res,
      "...",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`33 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - dots - convert off - numeric entity`, () => {
  mixer({
    removeWidows: false,
    convertDotsToEllipsis: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&#8230;", opt).res,
      "...",
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`34 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - ellipsis - long lines of many dots are not touched`, () => {
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
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`35 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - ellipsis - mix of false positives and a real deal`, () => {
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
      JSON.stringify(opt, null, 4),
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
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`36 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - ellipsis - mix of dots`, () => {
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
      JSON.stringify(opt, null, 4),
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
      JSON.stringify(opt, null, 4),
    );
  });
});

test(`37 - \u001b[${32}m${"ellipsis"}\u001b[${39}m - ellipsis - resembling real life`, () => {
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
      JSON.stringify(opt, null, 4),
    );
  });
});

test.run();
