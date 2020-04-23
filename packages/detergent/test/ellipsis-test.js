import tap from "tap";
// import { det as det1 } from "../dist/detergent.esm";
import {
  det,
  mixer, // , allCombinations
} from "../t-util/util";
import {
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  // rawNbsp,
  // rawhairspace,
  rawEllipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote
} from "../src/util";

// -----------------------------------------------------------------------------

tap.test(
  `01.01 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - horizontal ellipsis sanity check - convert off - raw`,
  (t) => {
    mixer({
      convertDotsToEllipsis: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `${rawEllipsis}`, opt).res,
        "...",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.02 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - horizontal ellipsis sanity check - convert off - encoded`,
  (t) => {
    mixer({
      convertDotsToEllipsis: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&hellip;", opt).res,
        "...",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.03 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - horizontal ellipsis sanity check - convert off - wrongly encoded`,
  (t) => {
    mixer({
      convertDotsToEllipsis: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&mldr;", opt).res,
        "...",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.04 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - raw - encodes the ellipsis when it has to`,
  (t) => {
    mixer({
      convertEntities: 1,
      convertDotsToEllipsis: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `${rawEllipsis}`, opt).res,
        "&hellip;",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.05 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - correctly encoded - converts`,
  (t) => {
    mixer({
      convertEntities: 1,
      convertDotsToEllipsis: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&hellip;", opt).res,
        "&hellip;",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.06 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - wrongly encoded - convert on`,
  (t) => {
    mixer({
      convertEntities: 1,
      convertDotsToEllipsis: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&mldr;", opt).res,
        "&hellip;",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.07 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - raw - siwtched off setting converts explicitly`,
  (t) => {
    mixer({
      convertDotsToEllipsis: 0,
    }).forEach((opt, n) => {
      t.equal(det(t, n, "...", opt).res, "...", JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

tap.test(
  `01.08 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - raw - siwtched off setting converts explicitly`,
  (t) => {
    mixer({
      convertDotsToEllipsis: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "And then...", opt).res,
        "And then...",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.09 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - raw - siwtched off setting converts explicitly`,
  (t) => {
    mixer({
      convertDotsToEllipsis: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `${rawEllipsis}`, opt).res,
        "...",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.10 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - raw - siwtched off setting converts explicitly`,
  (t) => {
    mixer({
      convertDotsToEllipsis: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&hellip;", opt).res,
        "...",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.11 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - raw - siwtched off setting converts explicitly`,
  (t) => {
    mixer({
      convertDotsToEllipsis: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&mldr;", opt).res,
        "...",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.12 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - raw - convert off`,
  (t) => {
    mixer({
      convertEntities: 0,
      convertDotsToEllipsis: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `${rawEllipsis}`, opt).res,
        `${rawEllipsis}`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.13 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - raw - convert off`,
  (t) => {
    mixer({
      convertEntities: 0,
      convertDotsToEllipsis: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&hellip;", opt).res,
        `${rawEllipsis}`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.14 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - raw - convert off`,
  (t) => {
    mixer({
      convertEntities: 0,
      convertDotsToEllipsis: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&mldr;", opt).res,
        `${rawEllipsis}`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.15 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - three dots to unencoded hellip`,
  (t) => {
    mixer({
      convertEntities: 0,
      convertDotsToEllipsis: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "...", opt).res,
        `${rawEllipsis}`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.16 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - three dots to unencoded hellip`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 0,
      convertDotsToEllipsis: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "Aaaaa... Bbbbb... C...", opt).res,
        `Aaaaa${rawEllipsis} Bbbbb${rawEllipsis} C${rawEllipsis}`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.17 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - encoded hellip to unencoded hellip`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 0,
      convertDotsToEllipsis: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&hellip;", opt).res,
        `${rawEllipsis}`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.18 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - encoded mldr to unencoded hellip`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 0,
      convertDotsToEllipsis: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&mldr;", opt).res,
        `${rawEllipsis}`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.19 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - hexidecimal to unencoded hellip`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 0,
      convertDotsToEllipsis: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&#x02026;", opt).res,
        `${rawEllipsis}`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.20 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - decimal to unencoded hellip`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 0,
      convertDotsToEllipsis: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&#8230;", opt).res,
        `${rawEllipsis}`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.21 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert on - three dots to encoded hellip`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDotsToEllipsis: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "...", opt).res,
        "&hellip;",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.22 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert on - three dots to encoded hellip`,
  (t) => {
    mixer({
      convertEntities: 1,
      convertDotsToEllipsis: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "Aaaaa... Bbbbb... C...", opt).res,
        "Aaaaa&hellip; Bbbbb&hellip; C&hellip;",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.23 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert on - encoded hellip to encoded hellip`,
  (t) => {
    mixer({
      convertEntities: 1,
      convertDotsToEllipsis: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&hellip;", opt).res,
        "&hellip;",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.24 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert on - encoded mldr to encoded hellip`,
  (t) => {
    mixer({
      convertEntities: 1,
      convertDotsToEllipsis: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&mldr;", opt).res,
        "&hellip;",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.25 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert on - hexidecimal to encoded hellip`,
  (t) => {
    mixer({
      convertEntities: 1,
      convertDotsToEllipsis: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&#x02026;", opt).res,
        "&hellip;",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.26 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert on - decimal to encoded hellip`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDotsToEllipsis: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&#8230;", opt).res,
        "&hellip;",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.27 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert on - unencoded to encoded`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDotsToEllipsis: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `${rawEllipsis}`, opt).res,
        "&hellip;",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.28 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - three dots`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertDotsToEllipsis: 0,
    }).forEach((opt, n) => {
      t.equal(det(t, n, "...", opt).res, "...", JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

tap.test(
  `01.29 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - single letters`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertDotsToEllipsis: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "Aaaaa... Bbbbb... C...", opt).res,
        "Aaaaa... Bbbbb... C...",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.30 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - hellip entity`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertDotsToEllipsis: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&hellip;", opt).res,
        "...",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.31 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - mldr entity`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertDotsToEllipsis: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&mldr;", opt).res,
        "...",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.32 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - hex entity`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertDotsToEllipsis: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&#x02026;", opt).res,
        "...",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.33 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - numeric entity`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertDotsToEllipsis: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "&#8230;", opt).res,
        "...",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.34 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - ellipsis - long lines of many dots are not touched`,
  (t) => {
    const source =
      "Chapter 01 ..................... page 21\nChapter 02 ..................... page 43";
    mixer({
      replaceLineBreaks: 0,
      removeLineBreaks: 0,
      removeWidows: 0,
      convertEntities: 0,
    }).forEach((opt, n) => {
      t.equal(det(t, n, source, opt).res, source, JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

tap.test(
  `01.35 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - ellipsis - mix of false positives and a real deal`,
  (t) => {
    mixer({
      replaceLineBreaks: 0,
      removeLineBreaks: 0,
      removeWidows: 0,
      convertEntities: 0,
      convertDotsToEllipsis: 1, // <---------
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "Chapter 01 ..................... page 21\nChapter 02 ..................... page 43\nI said so...",
          opt
        ).res,
        `Chapter 01 ..................... page 21\nChapter 02 ..................... page 43\nI said so${rawEllipsis}`,
        JSON.stringify(opt, null, 4)
      );
    });
    mixer({
      replaceLineBreaks: 0,
      removeLineBreaks: 0,
      removeWidows: 0,
      convertEntities: 0,
      convertDotsToEllipsis: 0, // <---------
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "Chapter 01 ..................... page 21\nChapter 02 ..................... page 43\nI said so...",
          opt
        ).res,
        "Chapter 01 ..................... page 21\nChapter 02 ..................... page 43\nI said so...",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.36 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - ellipsis - mix of dots`,
  (t) => {
    mixer({
      replaceLineBreaks: 0,
      removeLineBreaks: 0,
      removeWidows: 0,
      convertEntities: 0,
      convertDotsToEllipsis: 1, // <---------
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "..... ... . ..", opt).res,
        `..... ${rawEllipsis} . ..`,
        JSON.stringify(opt, null, 4)
      );
    });
    mixer({
      replaceLineBreaks: 0,
      removeLineBreaks: 0,
      removeWidows: 0,
      convertEntities: 0,
      convertDotsToEllipsis: 0, // <---------
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "..... ... . ..", opt).res,
        "..... ... . ..",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.37 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - ellipsis - resembling real life`,
  (t) => {
    const source = "Contents.......page 01";
    mixer({
      replaceLineBreaks: 0,
      removeLineBreaks: 0,
      removeWidows: 0,
      convertEntities: 0,
    }).forEach((opt, n) => {
      t.equal(det(t, n, source, opt).res, source, JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);
