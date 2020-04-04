const t = require("tap");
const detergent = require("../dist/detergent.cjs");
const det1 = detergent.det;
const { det, mixer, allCombinations } = require("../t-util/util");
const {
  // rawReplacementMark,
  rawNDash,
  rawMDash,
  rawNbsp,
  // rawhairspace,
  // rawEllipsis,
  leftSingleQuote,
  rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
} = require("../src/util.js");

// -----------------------------------------------------------------------------

// following test is according to the Butterick's practical typography
// http://practicaltypography.com/hyphens-and-dashes.html
t.test(
  `01.01 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - converts dashes into N dashes: +dashes+entities-widows`,
  (t) => {
    mixer({
      convertDashes: 1,
      convertEntities: 1,
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "1880-1912, pages 330-39", opt).res,
        "1880&ndash;1912, pages 330&ndash;39",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `01.02 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - converts dashes into N dashes: +dashes-entities-widows`,
  (t) => {
    mixer({
      convertDashes: 1,
      convertEntities: 0,
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "1880-1912, pages 330-39", opt).res,
        "1880\u20131912, pages 330\u201339",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `01.03 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - doesn't convert N dashes when is not asked to: -dashes-widows`,
  (t) => {
    mixer({
      convertDashes: 0,
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "1880-1912, pages 330-39", opt).res,
        "1880-1912, pages 330-39",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

// example from Oxford A-Z Grammar and Punctuation
t.test(
  `01.04 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - A-Z - hyphen`,
  (t) => {
    mixer({
      convertDashes: 1,
      convertEntities: 1,
    }).forEach((opt, n) => {
      t.equal(det(t, n, "An A-Z guide", opt).res, "An A&ndash;Z guide");
    });
    mixer({
      convertDashes: 1,
      convertEntities: 0,
    }).forEach((opt, n) => {
      t.equal(det(t, n, "An A-Z guide", opt).res, "An A\u2013Z guide");
    });
    mixer({
      convertDashes: 0,
      convertEntities: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "An A-Z guide", opt).res,
        "An A-Z guide",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `01.05 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - A-Z - raw n-dash`,
  (t) => {
    mixer({
      convertDashes: 1,
      convertEntities: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `An A${rawNDash}Z guide`, opt).res,
        "An A&ndash;Z guide"
      );
    });
    mixer({
      convertDashes: 1,
      convertEntities: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `An A${rawNDash}Z guide`, opt).res,
        `An A${rawNDash}Z guide`
      );
    });
    mixer({
      convertDashes: 0,
      convertEntities: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `An A${rawNDash}Z guide`, opt).res,
        "An A-Z guide",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `01.06 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - A-Z - encoded n-dash`,
  (t) => {
    mixer({
      convertDashes: 1,
      convertEntities: 1,
    }).forEach((opt, n) => {
      t.equal(det(t, n, `An A&ndash;Z guide`, opt).res, "An A&ndash;Z guide");
    });
    mixer({
      convertDashes: 1,
      convertEntities: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `An A&ndash;Z guide`, opt).res,
        `An A${rawNDash}Z guide`
      );
    });
    mixer({
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `An A&ndash;Z guide`, opt).res,
        "An A-Z guide",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

//                                 m dashes
// -----------------------------------------------------------------------------

t.test(
  `02.01 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - converts with encoding entities: +dashes-widows+entities`,
  (t) => {
    mixer({
      convertDashes: 1,
      removeWidows: 0,
      convertEntities: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "some text - some more text", opt).res,
        "some text &mdash; some more text",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.02 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - converts without encoding entities: +dashes-widows-entities`,
  (t) => {
    mixer({
      convertDashes: 1,
      removeWidows: 0,
      convertEntities: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "some text - some more text", opt).res,
        `some text ${rawMDash} some more text`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.03 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - does not convert: -dashes-widows`,
  (t) => {
    mixer({
      convertDashes: 0,
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "some text - some more text", opt).res,
        "some text - some more text",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

// example adapted from Oxford A-Z Grammar and Punctuation, p.46
t.test(
  `02.04 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - adds between two words`,
  (t) => {
    mixer({
      convertDashes: 1,
      removeWidows: 0,
      convertEntities: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "In brute material terms, he was an accomplice - in fact, a conspirator - to the clearing of the ice-cream fridge.",
          opt
        ).res,
        `In brute material terms, he was an accomplice ${rawMDash} in fact, a conspirator ${rawMDash} to the clearing of the ice-cream fridge.`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.05 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - curly - convert entities on`,
  (t) => {
    mixer({
      convertDashes: 1,
      removeWidows: 0,
      convertEntities: 1,
      convertApostrophes: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          `I smiled and she said, ${leftSingleQuote}You mean you want me to-${rightSingleQuote}`,
          opt
        ).res,
        `I smiled and she said, &lsquo;You mean you want me to&mdash;&rsquo;`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.06 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - curly - convert entities off`,
  (t) => {
    mixer({
      convertDashes: 1,
      removeWidows: 0,
      convertEntities: 0,
      convertApostrophes: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          `I smiled and she said, ${leftSingleQuote}You mean you want me to-${rightSingleQuote}`,
          opt
        ).res,
        `I smiled and she said, ${leftSingleQuote}You mean you want me to${rawMDash}${rightSingleQuote}`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.07 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - curly - convert entities on`,
  (t) => {
    mixer({
      convertDashes: 1,
      removeWidows: 0,
      convertEntities: 1,
      convertApostrophes: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          `I smiled and she said, ${leftSingleQuote}You mean you want me to-${rightSingleQuote}`,
          opt
        ).res,
        `I smiled and she said, 'You mean you want me to&mdash;'`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.08 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - curly - convert entities off`,
  (t) => {
    mixer({
      convertDashes: 1,
      removeWidows: 0,
      convertEntities: 0,
      convertApostrophes: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          `I smiled and she said, ${leftSingleQuote}You mean you want me to-${rightSingleQuote}`,
          opt
        ).res,
        `I smiled and she said, 'You mean you want me to${rawMDash}'`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.09 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities on`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 1,
      convertApostrophes: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `I smiled and she said, 'You mean you want me to-'`, opt).res,
        `I smiled and she said, &lsquo;You mean you want me to&mdash;&rsquo;`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.10 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities on`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 1,
      convertApostrophes: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `I smiled and she said, 'You mean you want me to-'`, opt).res,
        `I smiled and she said, 'You mean you want me to&mdash;'`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.11 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities on`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 0,
      convertApostrophes: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `I smiled and she said, 'You mean you want me to-'`, opt).res,
        `I smiled and she said, &lsquo;You mean you want me to-&rsquo;`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.12 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities on`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 0,
      convertApostrophes: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `I smiled and she said, 'You mean you want me to-'`, opt).res,
        `I smiled and she said, 'You mean you want me to-'`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.13 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities off`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 0,
      convertDashes: 1,
      convertApostrophes: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `I smiled and she said, 'You mean you want me to-'`, opt).res,
        `I smiled and she said, ${leftSingleQuote}You mean you want me to${rawMDash}${rightSingleQuote}`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.14 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities off`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 0,
      convertDashes: 1,
      convertApostrophes: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `I smiled and she said, 'You mean you want me to-'`, opt).res,
        `I smiled and she said, 'You mean you want me to${rawMDash}'`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.15 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities off`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 0,
      convertDashes: 0,
      convertApostrophes: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `I smiled and she said, 'You mean you want me to-'`, opt).res,
        `I smiled and she said, ${leftSingleQuote}You mean you want me to-${rightSingleQuote}`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.16 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities off`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 0,
      convertDashes: 0,
      convertApostrophes: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `I smiled and she said, 'You mean you want me to-'`, opt).res,
        `I smiled and she said, 'You mean you want me to-'`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

// options are explicit:
// "off" means there won't be any m-dashes - any findings will be converted to hyphens
// "on" means there will be only m-dashes (where applicable)

t.test(
  `02.17 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    const res = `a &mdash; b`;
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 1,
    }).forEach((opt, n) => {
      t.equal(det(t, n, `a - b`, opt).res, res, JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

t.test(
  `02.18 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 1,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a - b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `02.19 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    const res = `a &mdash; b`;
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a &ndash; b`, opt).res,
        res,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.20 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 1,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &ndash; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `02.21 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    const res = `a &mdash; b`;
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a &mdash; b`, opt).res,
        res,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.22 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 1,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &mdash; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `02.23 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    const res = `a &mdash; b`;
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a ${rawNDash} b`, opt).res,
        res,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.24 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 1,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a ${rawNDash} b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `02.25 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    const res = `a &mdash; b`;
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a ${rawMDash} b`, opt).res,
        res,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.26 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 1,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a ${rawMDash} b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `02.27 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}, numerically-encoded dash`,
  (t) => {
    const res = `a &mdash; b`;
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 1,
    }).forEach((opt, n) => {
      // dash
      t.equal(
        det(t, n, `a &#x2D; b`, opt).res,
        res,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.28 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}, numerically-encoded dash`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 1,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &#x2D; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `02.29 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}, numerically-encoded n-dash`,
  (t) => {
    const res = `a &mdash; b`;
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 1,
    }).forEach((opt, n) => {
      // numeric entity, n-dash
      t.equal(
        det(t, n, `a &#x2013; b`, opt).res,
        res,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.30 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}, numerically-encoded n-dash`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 1,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &#x2013; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `02.31 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}, numerically-encoded m-dash`,
  (t) => {
    const res = `a &mdash; b`;
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 1,
    }).forEach((opt, n) => {
      // numeric entity, m-dash
      t.equal(
        det(t, n, `a &#x2014; b`, opt).res,
        res,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.32 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}, numerically-encoded m-dash`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 1,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &#x2014; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `02.33 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    const res = `a - b`;
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.equal(det(t, n, `a - b`, opt).res, res, JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

t.test(
  `02.34 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a - b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `02.35 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    const res = `a - b`;
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a &ndash; b`, opt).res,
        res,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.36 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &ndash; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `02.37 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    const res = `a - b`;
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a &mdash; b`, opt).res,
        res,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.38 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &mdash; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `02.39 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    const res = `a - b`;
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a ${rawNDash} b`, opt).res,
        res,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.40 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a ${rawNDash} b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `02.41 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    const res = `a - b`;
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a ${rawMDash} b`, opt).res,
        res,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.42 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a ${rawMDash} b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `02.43 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}, numerically-encoded dash`,
  (t) => {
    const res = `a - b`;
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a &#x2D; b`, opt).res,
        res,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.44 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}, numerically-encoded dash`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &#x2D; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `02.45 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}, numerically-encoded n-dash`,
  (t) => {
    const res = `a - b`;
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 0,
    }).forEach((opt, n) => {
      // n-dash
      t.equal(
        det(t, n, `a &#x2013; b`, opt).res,
        res,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.46 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}, numerically-encoded n-dash`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &#x2013; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `02.47 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}, numerically-encoded m-dash`,
  (t) => {
    const res = `a - b`;
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 0,
    }).forEach((opt, n) => {
      // m-dash
      t.equal(
        det(t, n, `a &#x2014; b`, opt).res,
        res,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `02.48 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}, numerically-encoded m-dash`,
  (t) => {
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &#x2014; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `02.49 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - quick ad-hoc 1`,
  (t) => {
    t.equal(det1(`abc def ghi jkl`).res, "abc def ghi&nbsp;jkl");
    t.end();
  }
);

t.test(
  `02.50 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - dash conversion off, widow removal on`,
  (t) => {
    t.equal(
      det1(`a &ndash; b`, {
        removeWidows: 1,
        convertEntities: 1,
        convertDashes: 0,
      }).res,
      `a&nbsp;- b`
    );
    t.end();
  }
);

//                              insurance
// -----------------------------------------------------------------------------

t.test(
  `03.01 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - if statements`,
  (t) => {
    allCombinations.forEach((opt, n) => {
      t.equal(
        det(t, n, "zzz{% if something %}yyy", opt).res,
        "zzz{% if something %}yyy",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `03.02 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - variables`,
  (t) => {
    allCombinations.forEach((opt, n) => {
      t.equal(
        det(t, n, "zzz{{ something }}yyy", opt).res,
        "zzz{{ something }}yyy",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `03.03 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - if statements`,
  (t) => {
    allCombinations.forEach((opt, n) => {
      // with Nunjucks whitespace collapse hyphen:
      t.equal(
        det(t, n, "zzz{%- if something -%}yyy", opt).res,
        "zzz{%- if something -%}yyy",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `03.04 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - collapsing variables`,
  (t) => {
    allCombinations.forEach((opt, n) => {
      t.equal(
        det(t, n, "zzz{{- something -}}yyy", opt).res,
        "zzz{{- something -}}yyy",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `03.05 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - raw m-dash sanity check`,
  (t) => {
    mixer({
      convertEntities: 0,
      convertDashes: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `m${rawMDash}m`, opt).res,
        `m${rawMDash}m`,
        JSON.stringify(opt, null, 4)
      );
    });
    mixer({
      convertEntities: 0,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `m${rawMDash}m`, opt).res,
        `m-m`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `03.06 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - leaves minuses alone with convert entities option off`,
  (t) => {
    mixer({
      convertEntities: 0,
    }).forEach((opt, n) => {
      t.equal(det(t, n, "m-m", opt).res, "m-m", JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

t.test(
  `03.07 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - leaves the m-dashes intact`,
  (t) => {
    mixer({
      convertEntities: 1,
      convertDashes: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `m${rawMDash}m`, opt).res,
        "m&mdash;m",
        JSON.stringify(opt, null, 4)
      );
    });
    mixer({
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `m${rawMDash}m`, opt).res,
        "m-m",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `03.08 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 1`,
  (t) => {
    const source = `{% if x %}a{% endif %} a &mdash; b`;
    mixer({
      removeWidows: 1,
      convertEntities: 1,
      convertDashes: 1,
    }).forEach((opt, n) => {
      t.equal(
        det1(source, opt).res,
        "{% if x %}a{% endif %} a&nbsp;&mdash;&nbsp;b"
      );
      t.equal(
        det(t, n, source, opt).res,
        "{% if x %}a{% endif %} a&nbsp;&mdash;&nbsp;b",
        JSON.stringify(opt, null, 4)
      );
      t.ok(det(t, n, source, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `03.09 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 2`,
  (t) => {
    const source = `{% if x %}a{% endif %} a &mdash; b`;
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 1,
    }).forEach((opt, n) => {
      t.equal(det(t, n, source, opt).res, source, JSON.stringify(opt, null, 4));
      t.ok(det(t, n, source, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `03.10 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 3`,
  (t) => {
    const source = `{% if x %}a{% endif %} a &mdash; b`;
    mixer({
      removeWidows: 1,
      convertEntities: 0,
      convertDashes: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, source, opt).res,
        `{% if x %}a{% endif %} a${rawNbsp}${rawMDash}${rawNbsp}b`,
        JSON.stringify(opt, null, 4)
      );
      t.ok(det(t, n, source, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `03.11 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 4`,
  (t) => {
    const source = `{% if x %}a{% endif %} a &mdash; b`;
    mixer({
      removeWidows: 0,
      convertEntities: 0,
      convertDashes: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, source, opt).res,
        `{% if x %}a{% endif %} a ${rawMDash} b`,
        JSON.stringify(opt, null, 4)
      );
      t.ok(det(t, n, source, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `03.12 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 5`,
  (t) => {
    const source = `{% if x %}a{% endif %} a &mdash; b`;
    mixer({
      removeWidows: 1,
      convertEntities: 1,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, source, opt).res,
        "{% if x %}a{% endif %} a&nbsp;-&nbsp;b",
        JSON.stringify(opt, null, 4)
      );
      t.ok(det(t, n, source, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `03.13 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 6`,
  (t) => {
    const source = `{% if x %}a{% endif %} a &mdash; b`;
    mixer({
      removeWidows: 0,
      convertEntities: 1,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, source, opt).res,
        `{% if x %}a{% endif %} a - b`,
        JSON.stringify(opt, null, 4)
      );
      t.ok(det(t, n, source, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `03.14 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 7`,
  (t) => {
    const source = `{% if x %}a{% endif %} a &mdash; b`;
    mixer({
      removeWidows: 1,
      convertEntities: 0,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, source, opt).res,
        `{% if x %}a{% endif %} a${rawNbsp}-${rawNbsp}b`,
        JSON.stringify(opt, null, 4)
      );
      t.ok(det(t, n, source, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

t.test(
  `03.15 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 8`,
  (t) => {
    const source = `{% if x %}a{% endif %} a &mdash; b`;
    mixer({
      removeWidows: 0,
      convertEntities: 0,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, source, opt).res,
        `{% if x %}a{% endif %} a - b`,
        JSON.stringify(opt, null, 4)
      );
      t.ok(det(t, n, source, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

//                                 minuses
// -----------------------------------------------------------------------------

t.test(
  `04.01 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - leaves minuses alone with convert entities option on`,
  (t) => {
    mixer({
      convertEntities: 1,
    }).forEach((opt, n) => {
      t.equal(det(t, n, "m-m", opt).res, "m-m", JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

t.test(
  `04.02 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - legit minus between two numbers`,
  (t) => {
    mixer({
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        // nothing to convert:
        det(t, n, `1 - 2 = 3`, opt).res,
        `1 - 2 = 3`
      );
    });
    t.end();
  }
);

t.test(
  `04.03 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - minus and number, too short to widow removal`,
  (t) => {
    mixer({
      convertEntities: 0,
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "Temperatures of -20°C", opt).res,
        "Temperatures of -20°C"
      );
      t.equal(
        det(t, n, "-20°C", opt).res,
        "-20°C",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `04.04 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - deg HTML entity`,
  (t) => {
    mixer({
      convertEntities: 1,
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "Temperatures of -20°C", opt).res,
        "Temperatures of -20&deg;C"
      );
      t.equal(
        det(t, n, "-20°C", opt).res,
        "-20&deg;C",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `04.05 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - deg HTML entity in a sentence - widows=on`,
  (t) => {
    mixer({
      convertEntities: 1,
      removeWidows: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "The records show that there were temperatures as low as -20°C",
          opt
        ).res,
        "The records show that there were temperatures as low as&nbsp;-20&deg;C",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `04.06 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - deg HTML entity in a sentence - widows=off`,
  (t) => {
    mixer({
      convertEntities: 1,
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "The records show that there were temperatures as low as -20°C",
          opt
        ).res,
        "The records show that there were temperatures as low as -20&deg;C",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `04.07 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - minus and number, clashing with widow removal - widows=on, entities=off`,
  (t) => {
    mixer({
      convertEntities: 0,
      removeWidows: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "The records show that there were temperatures as low as -20°C",
          opt
        ).res,
        "The records show that there were temperatures as low as\u00A0-20°C",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `04.08 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - minus and number, clashing with widow removal - widows=off, entities=off`,
  (t) => {
    mixer({
      convertEntities: 0,
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "The records show that there were temperatures as low as -20°C",
          opt
        ).res,
        "The records show that there were temperatures as low as -20°C",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

//                                 hyphens
// -----------------------------------------------------------------------------

t.test(
  `05.01 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - no full stop`,
  (t) => {
    allCombinations.forEach((opt, n) => {
      t.equal(
        det(t, n, "Stratford-upon-Avon", opt).res,
        "Stratford-upon-Avon",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `05.02 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - no full stop, longer sentence`,
  (t) => {
    mixer({
      convertEntities: 1,
      removeWidows: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "One day we should visit Stratford-upon-Avon", opt).res,
        "One day we should visit&nbsp;Stratford-upon-Avon",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `05.03 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - full stop`,
  (t) => {
    mixer({
      convertEntities: 1,
      removeWidows: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "One day we should visit Stratford-upon-Avon.", opt).res,
        "One day we should visit&nbsp;Stratford-upon-Avon.",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `05.04 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - no full stop, widows=off`,
  (t) => {
    mixer({
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "One day we should visit Stratford-upon-Avon", opt).res,
        "One day we should visit Stratford-upon-Avon",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `05.05 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - full stop, widows=off`,
  (t) => {
    mixer({
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "One day we should visit Stratford-upon-Avon.", opt).res,
        "One day we should visit Stratford-upon-Avon.",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

t.test(
  `05.06 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - when dashes are off, widow removal still works`,
  (t) => {
    t.equal(
      det1("a - b", {
        removeWidows: 1,
        convertEntities: 1,
        convertDashes: 0,
      }).res,
      `a&nbsp;- b`
    );
    t.ok(
      det1("a - b", {
        removeWidows: 0,
        convertEntities: 0,
        convertDashes: 0,
      }).applicableOpts.removeWidows
    );

    mixer({
      removeWidows: 1,
      convertEntities: 1,
      convertDashes: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "One day - and I mean some day - we will travel", opt).res,
        `One day&nbsp;- and I mean some day&nbsp;- we will&nbsp;travel`,
        JSON.stringify(opt, null, 4)
      );
    });

    t.end();
  }
);
