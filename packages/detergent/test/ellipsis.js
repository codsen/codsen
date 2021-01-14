import tap from "tap";
// import { det as det1 } from "../dist/detergent.esm";
import {
  det,
  mixer,
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
} from "../t-util/util";

// -----------------------------------------------------------------------------

tap.test(
  `01 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - horizontal ellipsis sanity check - convert off - raw`,
  (t) => {
    mixer({
      convertDotsToEllipsis: false,
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
  `02 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - horizontal ellipsis sanity check - convert off - encoded`,
  (t) => {
    mixer({
      convertDotsToEllipsis: false,
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
  `03 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - horizontal ellipsis sanity check - convert off - wrongly encoded`,
  (t) => {
    mixer({
      convertDotsToEllipsis: false,
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
  `04 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - raw - encodes the ellipsis when it has to`,
  (t) => {
    mixer({
      convertEntities: true,
      convertDotsToEllipsis: true,
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
  `05 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - correctly encoded - converts`,
  (t) => {
    mixer({
      convertEntities: true,
      convertDotsToEllipsis: true,
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
  `06 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - wrongly encoded - convert on`,
  (t) => {
    mixer({
      convertEntities: true,
      convertDotsToEllipsis: true,
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
  `07 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - raw - siwtched off setting converts explicitly`,
  (t) => {
    mixer({
      convertDotsToEllipsis: false,
    }).forEach((opt, n) => {
      t.equal(det(t, n, "...", opt).res, "...", JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

tap.test(
  `08 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - raw - siwtched off setting converts explicitly`,
  (t) => {
    mixer({
      convertDotsToEllipsis: false,
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
  `09 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - raw - siwtched off setting converts explicitly`,
  (t) => {
    mixer({
      convertDotsToEllipsis: false,
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
  `10 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - raw - siwtched off setting converts explicitly`,
  (t) => {
    mixer({
      convertDotsToEllipsis: false,
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
  `11 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - raw - siwtched off setting converts explicitly`,
  (t) => {
    mixer({
      convertDotsToEllipsis: false,
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
  `12 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - raw - convert off`,
  (t) => {
    mixer({
      convertEntities: false,
      convertDotsToEllipsis: true,
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
  `13 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - raw - convert off`,
  (t) => {
    mixer({
      convertEntities: false,
      convertDotsToEllipsis: true,
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
  `14 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - raw - convert off`,
  (t) => {
    mixer({
      convertEntities: false,
      convertDotsToEllipsis: true,
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
  `15 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - three dots to unencoded hellip`,
  (t) => {
    mixer({
      convertEntities: false,
      convertDotsToEllipsis: true,
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
  `16 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - three dots to unencoded hellip`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: false,
      convertDotsToEllipsis: true,
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
  `17 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - encoded hellip to unencoded hellip`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: false,
      convertDotsToEllipsis: true,
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
  `18 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - encoded mldr to unencoded hellip`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: false,
      convertDotsToEllipsis: true,
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
  `19 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - hexidecimal to unencoded hellip`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: false,
      convertDotsToEllipsis: true,
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
  `20 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - decimal to unencoded hellip`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: false,
      convertDotsToEllipsis: true,
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
  `21 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert on - three dots to encoded hellip`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDotsToEllipsis: true,
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
  `22 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert on - three dots to encoded hellip`,
  (t) => {
    mixer({
      convertEntities: true,
      convertDotsToEllipsis: true,
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
  `23 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert on - encoded hellip to encoded hellip`,
  (t) => {
    mixer({
      convertEntities: true,
      convertDotsToEllipsis: true,
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
  `24 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert on - encoded mldr to encoded hellip`,
  (t) => {
    mixer({
      convertEntities: true,
      convertDotsToEllipsis: true,
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
  `25 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert on - hexidecimal to encoded hellip`,
  (t) => {
    mixer({
      convertEntities: true,
      convertDotsToEllipsis: true,
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
  `26 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert on - decimal to encoded hellip`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDotsToEllipsis: true,
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
  `27 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert on - unencoded to encoded`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDotsToEllipsis: true,
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
  `28 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - three dots`,
  (t) => {
    mixer({
      removeWidows: false,
      convertDotsToEllipsis: false,
    }).forEach((opt, n) => {
      t.equal(det(t, n, "...", opt).res, "...", JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

tap.test(
  `29 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - single letters`,
  (t) => {
    mixer({
      removeWidows: false,
      convertDotsToEllipsis: false,
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
  `30 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - hellip entity`,
  (t) => {
    mixer({
      removeWidows: false,
      convertDotsToEllipsis: false,
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
  `31 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - mldr entity`,
  (t) => {
    mixer({
      removeWidows: false,
      convertDotsToEllipsis: false,
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
  `32 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - hex entity`,
  (t) => {
    mixer({
      removeWidows: false,
      convertDotsToEllipsis: false,
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
  `33 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - dots - convert off - numeric entity`,
  (t) => {
    mixer({
      removeWidows: false,
      convertDotsToEllipsis: false,
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
  `34 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - ellipsis - long lines of many dots are not touched`,
  (t) => {
    const source =
      "Chapter 01 ..................... page 21\nChapter 02 ..................... page 43";
    mixer({
      replaceLineBreaks: false,
      removeLineBreaks: false,
      removeWidows: false,
      convertEntities: false,
    }).forEach((opt, n) => {
      t.equal(det(t, n, source, opt).res, source, JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

tap.test(
  `35 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - ellipsis - mix of false positives and a real deal`,
  (t) => {
    mixer({
      replaceLineBreaks: false,
      removeLineBreaks: false,
      removeWidows: false,
      convertEntities: false,
      convertDotsToEllipsis: true, // <---------
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
      replaceLineBreaks: false,
      removeLineBreaks: false,
      removeWidows: false,
      convertEntities: false,
      convertDotsToEllipsis: false, // <---------
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
  `36 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - ellipsis - mix of dots`,
  (t) => {
    mixer({
      replaceLineBreaks: false,
      removeLineBreaks: false,
      removeWidows: false,
      convertEntities: false,
      convertDotsToEllipsis: true, // <---------
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "..... ... . ..", opt).res,
        `..... ${rawEllipsis} . ..`,
        JSON.stringify(opt, null, 4)
      );
    });
    mixer({
      replaceLineBreaks: false,
      removeLineBreaks: false,
      removeWidows: false,
      convertEntities: false,
      convertDotsToEllipsis: false, // <---------
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
  `37 - \u001b[${32}m${`ellipsis`}\u001b[${39}m - ellipsis - resembling real life`,
  (t) => {
    const source = "Contents.......page 01";
    mixer({
      replaceLineBreaks: false,
      removeLineBreaks: false,
      removeWidows: false,
      convertEntities: false,
    }).forEach((opt, n) => {
      t.equal(det(t, n, source, opt).res, source, JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);
