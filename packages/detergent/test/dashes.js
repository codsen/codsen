import tap from "tap";
import { det as det1 } from "../dist/detergent.esm.js";
import {
  det,
  mixer,
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
} from "../t-util/util.js";

// -----------------------------------------------------------------------------

// following test is according to the Butterick's practical typography
// http://practicaltypography.com/hyphens-and-dashes.html
tap.test(
  `01 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - converts dashes into N dashes: +dashes+entities-widows`,
  (t) => {
    mixer({
      convertDashes: true,
      convertEntities: true,
      removeWidows: false,
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

tap.test(
  `02 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - converts dashes into N dashes: +dashes-entities-widows`,
  (t) => {
    mixer({
      convertDashes: true,
      convertEntities: false,
      removeWidows: false,
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

tap.test(
  `03 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - doesn't convert N dashes when is not asked to: -dashes-widows`,
  (t) => {
    mixer({
      convertDashes: false,
      removeWidows: false,
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
tap.test(
  `04 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - A-Z - hyphen`,
  (t) => {
    mixer({
      convertDashes: true,
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(det(t, n, "An A-Z guide", opt).res, "An A&ndash;Z guide");
    });
    mixer({
      convertDashes: true,
      convertEntities: false,
    }).forEach((opt, n) => {
      t.equal(det(t, n, "An A-Z guide", opt).res, "An A\u2013Z guide");
    });
    mixer({
      convertDashes: false,
      convertEntities: false,
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

tap.test(
  `05 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - A-Z - raw n-dash`,
  (t) => {
    mixer({
      convertDashes: true,
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `An A${rawNDash}Z guide`, opt).res,
        "An A&ndash;Z guide"
      );
    });
    mixer({
      convertDashes: true,
      convertEntities: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `An A${rawNDash}Z guide`, opt).res,
        `An A${rawNDash}Z guide`
      );
    });
    mixer({
      convertDashes: false,
      convertEntities: false,
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

tap.test(
  `06 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - A-Z - encoded n-dash`,
  (t) => {
    mixer({
      convertDashes: true,
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(det(t, n, `An A&ndash;Z guide`, opt).res, "An A&ndash;Z guide");
    });
    mixer({
      convertDashes: true,
      convertEntities: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `An A&ndash;Z guide`, opt).res,
        `An A${rawNDash}Z guide`
      );
    });
    mixer({
      convertDashes: false,
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

tap.test(
  `07 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - converts with encoding entities: +dashes-widows+entities`,
  (t) => {
    mixer({
      convertDashes: true,
      removeWidows: false,
      convertEntities: true,
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

tap.test(
  `08 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - converts without encoding entities: +dashes-widows-entities`,
  (t) => {
    mixer({
      convertDashes: true,
      removeWidows: false,
      convertEntities: false,
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

tap.test(
  `09 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - does not convert: -dashes-widows`,
  (t) => {
    mixer({
      convertDashes: false,
      removeWidows: false,
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
tap.test(
  `10 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - adds between two words`,
  (t) => {
    mixer({
      convertDashes: true,
      removeWidows: false,
      convertEntities: false,
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

tap.test(
  `11 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - curly - convert entities on`,
  (t) => {
    mixer({
      convertDashes: true,
      removeWidows: false,
      convertEntities: true,
      convertApostrophes: true,
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

tap.test(
  `12 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - curly - convert entities off`,
  (t) => {
    mixer({
      convertDashes: true,
      removeWidows: false,
      convertEntities: false,
      convertApostrophes: true,
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

tap.test(
  `13 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - curly - convert entities on`,
  (t) => {
    mixer({
      convertDashes: true,
      removeWidows: false,
      convertEntities: true,
      convertApostrophes: false,
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

tap.test(
  `14 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - curly - convert entities off`,
  (t) => {
    mixer({
      convertDashes: true,
      removeWidows: false,
      convertEntities: false,
      convertApostrophes: false,
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

tap.test(
  `15 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities on`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: true,
      convertApostrophes: true,
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

tap.test(
  `16 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities on`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: true,
      convertApostrophes: false,
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

tap.test(
  `17 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities on`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: false,
      convertApostrophes: true,
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

tap.test(
  `18 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities on`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: false,
      convertApostrophes: false,
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

tap.test(
  `19 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities off`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: false,
      convertDashes: true,
      convertApostrophes: true,
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

tap.test(
  `20 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities off`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: false,
      convertDashes: true,
      convertApostrophes: false,
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

tap.test(
  `21 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities off`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: false,
      convertDashes: false,
      convertApostrophes: true,
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

tap.test(
  `22 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities off`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: false,
      convertDashes: false,
      convertApostrophes: false,
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

tap.test(
  `23 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    const res = `a &mdash; b`;
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: true,
    }).forEach((opt, n) => {
      t.equal(det(t, n, `a - b`, opt).res, res, JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

tap.test(
  `24 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: true,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a - b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

tap.test(
  `25 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    const res = `a &mdash; b`;
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: true,
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

tap.test(
  `26 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: true,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &ndash; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

tap.test(
  `27 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    const res = `a &mdash; b`;
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: true,
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

tap.test(
  `28 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: true,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &mdash; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

tap.test(
  `29 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    const res = `a &mdash; b`;
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: true,
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

tap.test(
  `30 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: true,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a ${rawNDash} b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

tap.test(
  `31 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    const res = `a &mdash; b`;
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: true,
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

tap.test(
  `32 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: true,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a ${rawMDash} b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

tap.test(
  `33 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}, numerically-encoded dash`,
  (t) => {
    const res = `a &mdash; b`;
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: true,
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

tap.test(
  `34 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}, numerically-encoded dash`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: true,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &#x2D; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

tap.test(
  `35 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}, numerically-encoded n-dash`,
  (t) => {
    const res = `a &mdash; b`;
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: true,
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

tap.test(
  `36 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}, numerically-encoded n-dash`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: true,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &#x2013; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

tap.test(
  `37 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}, numerically-encoded m-dash`,
  (t) => {
    const res = `a &mdash; b`;
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: true,
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

tap.test(
  `38 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}, numerically-encoded m-dash`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: true,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &#x2014; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

tap.test(
  `39 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    const res = `a - b`;
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: false,
    }).forEach((opt, n) => {
      t.equal(det(t, n, `a - b`, opt).res, res, JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

tap.test(
  `40 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: false,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a - b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

tap.test(
  `41 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    const res = `a - b`;
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: false,
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

tap.test(
  `42 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: false,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &ndash; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

tap.test(
  `43 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    const res = `a - b`;
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: false,
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

tap.test(
  `44 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: false,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &mdash; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

tap.test(
  `45 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    const res = `a - b`;
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: false,
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

tap.test(
  `46 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: false,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a ${rawNDash} b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

tap.test(
  `47 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    const res = `a - b`;
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: false,
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

tap.test(
  `48 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: false,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a ${rawMDash} b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

tap.test(
  `49 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}, numerically-encoded dash`,
  (t) => {
    const res = `a - b`;
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: false,
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

tap.test(
  `50 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}, numerically-encoded dash`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: false,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &#x2D; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

tap.test(
  `51 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}, numerically-encoded n-dash`,
  (t) => {
    const res = `a - b`;
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: false,
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

tap.test(
  `52 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}, numerically-encoded n-dash`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: false,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &#x2013; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

tap.test(
  `53 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}, numerically-encoded m-dash`,
  (t) => {
    const res = `a - b`;
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: false,
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

tap.test(
  `54 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}, numerically-encoded m-dash`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: false,
    }).forEach((opt, n) => {
      t.ok(det(t, n, `a &#x2014; b`, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

tap.test(
  `55 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - quick ad-hoc 1`,
  (t) => {
    t.equal(det1(`abc def ghi jkl`).res, "abc def ghi&nbsp;jkl", "55");
    t.end();
  }
);

tap.test(
  `56 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - dash conversion off, widow removal on`,
  (t) => {
    t.equal(
      det1(`a &ndash; b`, {
        removeWidows: true,
        convertEntities: true,
        convertDashes: false,
      }).res,
      `a&nbsp;- b`,
      "56"
    );
    t.end();
  }
);

//                              insurance
// -----------------------------------------------------------------------------

tap.test(
  `57 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - if statements`,
  (t) => {
    mixer().forEach((opt, n) => {
      t.equal(
        det(t, n, "zzz{% if something %}yyy", opt).res,
        "zzz{% if something %}yyy",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `58 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - variables`,
  (t) => {
    mixer().forEach((opt, n) => {
      t.equal(
        det(t, n, "zzz{{ something }}yyy", opt).res,
        "zzz{{ something }}yyy",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `59 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - if statements`,
  (t) => {
    mixer().forEach((opt, n) => {
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

tap.test(
  `60 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - collapsing variables`,
  (t) => {
    mixer().forEach((opt, n) => {
      t.equal(
        det(t, n, "zzz{{- something -}}yyy", opt).res,
        "zzz{{- something -}}yyy",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `61 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - raw m-dash sanity check`,
  (t) => {
    mixer({
      convertEntities: false,
      convertDashes: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `m${rawMDash}m`, opt).res,
        `m${rawMDash}m`,
        JSON.stringify(opt, null, 4)
      );
    });
    mixer({
      convertEntities: false,
      convertDashes: false,
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

tap.test(
  `62 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - leaves minuses alone with convert entities option off`,
  (t) => {
    mixer({
      convertEntities: false,
    }).forEach((opt, n) => {
      t.equal(det(t, n, "m-m", opt).res, "m-m", JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

tap.test(
  `63 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - leaves the m-dashes intact`,
  (t) => {
    mixer({
      convertEntities: true,
      convertDashes: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `m${rawMDash}m`, opt).res,
        "m&mdash;m",
        JSON.stringify(opt, null, 4)
      );
    });
    mixer({
      convertDashes: false,
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

tap.test(
  `64 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 1`,
  (t) => {
    const source = `{% if x %}a{% endif %} a &mdash; b`;
    mixer({
      removeWidows: true,
      convertEntities: true,
      convertDashes: true,
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

tap.test(
  `65 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 2`,
  (t) => {
    const source = `{% if x %}a{% endif %} a &mdash; b`;
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: true,
    }).forEach((opt, n) => {
      t.equal(det(t, n, source, opt).res, source, JSON.stringify(opt, null, 4));
      t.ok(det(t, n, source, opt).applicableOpts.convertDashes);
    });
    t.end();
  }
);

tap.test(
  `66 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 3`,
  (t) => {
    const source = `{% if x %}a{% endif %} a &mdash; b`;
    mixer({
      removeWidows: true,
      convertEntities: false,
      convertDashes: true,
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

tap.test(
  `67 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 4`,
  (t) => {
    const source = `{% if x %}a{% endif %} a &mdash; b`;
    mixer({
      removeWidows: false,
      convertEntities: false,
      convertDashes: true,
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

tap.test(
  `68 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 5`,
  (t) => {
    const source = `{% if x %}a{% endif %} a &mdash; b`;
    mixer({
      removeWidows: true,
      convertEntities: true,
      convertDashes: false,
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

tap.test(
  `69 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 6`,
  (t) => {
    const source = `{% if x %}a{% endif %} a &mdash; b`;
    mixer({
      removeWidows: false,
      convertEntities: true,
      convertDashes: false,
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

tap.test(
  `70 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 7`,
  (t) => {
    const source = `{% if x %}a{% endif %} a &mdash; b`;
    mixer({
      removeWidows: true,
      convertEntities: false,
      convertDashes: false,
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

tap.test(
  `71 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 8`,
  (t) => {
    const source = `{% if x %}a{% endif %} a &mdash; b`;
    mixer({
      removeWidows: false,
      convertEntities: false,
      convertDashes: false,
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

tap.test(
  `72 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - leaves minuses alone with convert entities option on`,
  (t) => {
    mixer({
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(det(t, n, "m-m", opt).res, "m-m", JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

tap.test(
  `73 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - legit minus between two numbers`,
  (t) => {
    mixer({
      removeWidows: false,
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

tap.test(
  `74 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - minus and number, too short to widow removal`,
  (t) => {
    mixer({
      convertEntities: false,
      removeWidows: false,
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

tap.test(
  `75 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - deg HTML entity`,
  (t) => {
    mixer({
      convertEntities: true,
      removeWidows: false,
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

tap.test(
  `76 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - deg HTML entity in a sentence - widows=on`,
  (t) => {
    mixer({
      convertEntities: true,
      removeWidows: true,
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

tap.test(
  `77 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - deg HTML entity in a sentence - widows=off`,
  (t) => {
    mixer({
      convertEntities: true,
      removeWidows: false,
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

tap.test(
  `78 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - minus and number, clashing with widow removal - widows=on, entities=off`,
  (t) => {
    mixer({
      convertEntities: false,
      removeWidows: true,
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

tap.test(
  `79 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - minus and number, clashing with widow removal - widows=off, entities=off`,
  (t) => {
    mixer({
      convertEntities: false,
      removeWidows: false,
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

tap.test(
  `80 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - no full stop`,
  (t) => {
    mixer().forEach((opt, n) => {
      t.equal(
        det(t, n, "Stratford-upon-Avon", opt).res,
        "Stratford-upon-Avon",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `81 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - no full stop, longer sentence`,
  (t) => {
    mixer({
      convertEntities: true,
      removeWidows: true,
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

tap.test(
  `82 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - full stop`,
  (t) => {
    mixer({
      convertEntities: true,
      removeWidows: true,
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

tap.test(
  `83 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - no full stop, widows=off`,
  (t) => {
    mixer({
      removeWidows: false,
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

tap.test(
  `84 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - full stop, widows=off`,
  (t) => {
    mixer({
      removeWidows: false,
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

tap.test(
  `85 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - when dashes are off, widow removal still works`,
  (t) => {
    t.equal(
      det1("a - b", {
        removeWidows: true,
        convertEntities: true,
        convertDashes: false,
      }).res,
      `a&nbsp;- b`,
      "85.01"
    );
    t.ok(
      det1("a - b", {
        removeWidows: false,
        convertEntities: false,
        convertDashes: false,
      }).applicableOpts.removeWidows,
      "85.02"
    );

    mixer({
      removeWidows: true,
      convertEntities: true,
      convertDashes: false,
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
