import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";
import {
  // rawReplacementMark,
  rawNDash,
  rawMDash,
  rawNbsp,
  // hairspace,
  // ellipsis,
  rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  leftSingleQuote,
} from "codsen-utils";

// -----------------------------------------------------------------------------

// following test is according to the Butterick's practical typography
// http://practicaltypography.com/hyphens-and-dashes.html
test(`01 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - converts dashes into N dashes: +dashes+entities-widows`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "1880-1912, pages 330-39", opt).res,
      "1880&ndash;1912, pages 330&ndash;39",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`02 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - converts dashes into N dashes: +dashes-entities-widows`, () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "1880-1912, pages 330-39", opt).res,
      "1880\u20131912, pages 330\u201339",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`03 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - doesn't convert N dashes when is not asked to: -dashes-widows`, () => {
  mixer({
    convertDashes: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "1880-1912, pages 330-39", opt).res,
      "1880-1912, pages 330-39",
      JSON.stringify(opt, null, 4)
    );
  });
});

// example from Oxford A-Z Grammar and Punctuation
test(`04 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - A-Z - hyphen`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "An A-Z guide", opt).res, "An A&ndash;Z guide");
  });
  mixer({
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "An A-Z guide", opt).res, "An A\u2013Z guide");
  });
  mixer({
    convertDashes: false,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "An A-Z guide", opt).res,
      "An A-Z guide",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`05 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - A-Z - raw n-dash`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `An A${rawNDash}Z guide`, opt).res,
      "An A&ndash;Z guide"
    );
  });
  mixer({
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `An A${rawNDash}Z guide`, opt).res,
      `An A${rawNDash}Z guide`
    );
  });
  mixer({
    convertDashes: false,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `An A${rawNDash}Z guide`, opt).res,
      "An A-Z guide",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`06 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - A-Z - encoded n-dash`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, `An A&ndash;Z guide`, opt).res, "An A&ndash;Z guide");
  });
  mixer({
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `An A&ndash;Z guide`, opt).res,
      `An A${rawNDash}Z guide`
    );
  });
  mixer({
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `An A&ndash;Z guide`, opt).res,
      "An A-Z guide",
      JSON.stringify(opt, null, 4)
    );
  });
});

//                                 m dashes
// -----------------------------------------------------------------------------

test(`07 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - converts with encoding entities: +dashes-widows+entities`, () => {
  mixer({
    convertDashes: true,
    removeWidows: false,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "some text - some more text", opt).res,
      "some text &mdash; some more text",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`08 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - converts without encoding entities: +dashes-widows-entities`, () => {
  mixer({
    convertDashes: true,
    removeWidows: false,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "some text - some more text", opt).res,
      `some text ${rawMDash} some more text`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`09 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - does not convert: -dashes-widows`, () => {
  mixer({
    convertDashes: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "some text - some more text", opt).res,
      "some text - some more text",
      JSON.stringify(opt, null, 4)
    );
  });
});

// example adapted from Oxford A-Z Grammar and Punctuation, p.46
test(`10 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - adds between two words`, () => {
  mixer({
    convertDashes: true,
    removeWidows: false,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "In brute material terms, he was an accomplice - in fact, a conspirator - to the clearing of the ice-cream fridge.",
        opt
      ).res,
      `In brute material terms, he was an accomplice ${rawMDash} in fact, a conspirator ${rawMDash} to the clearing of the ice-cream fridge.`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`11 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - curly - convert entities on`, () => {
  mixer({
    convertDashes: true,
    removeWidows: false,
    convertEntities: true,
    convertApostrophes: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `I smiled and she said, ${leftSingleQuote}You mean you want me to-${rightSingleQuote}`,
        opt
      ).res,
      `I smiled and she said, &lsquo;You mean you want me to&mdash;&rsquo;`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`12 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - curly - convert entities off`, () => {
  mixer({
    convertDashes: true,
    removeWidows: false,
    convertEntities: false,
    convertApostrophes: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `I smiled and she said, ${leftSingleQuote}You mean you want me to-${rightSingleQuote}`,
        opt
      ).res,
      `I smiled and she said, ${leftSingleQuote}You mean you want me to${rawMDash}${rightSingleQuote}`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`13 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - curly - convert entities on`, () => {
  mixer({
    convertDashes: true,
    removeWidows: false,
    convertEntities: true,
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `I smiled and she said, ${leftSingleQuote}You mean you want me to-${rightSingleQuote}`,
        opt
      ).res,
      `I smiled and she said, 'You mean you want me to&mdash;'`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`14 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - curly - convert entities off`, () => {
  mixer({
    convertDashes: true,
    removeWidows: false,
    convertEntities: false,
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `I smiled and she said, ${leftSingleQuote}You mean you want me to-${rightSingleQuote}`,
        opt
      ).res,
      `I smiled and she said, 'You mean you want me to${rawMDash}'`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`15 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities on`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
    convertApostrophes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `I smiled and she said, 'You mean you want me to-'`, opt)
        .res,
      `I smiled and she said, &lsquo;You mean you want me to&mdash;&rsquo;`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`16 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities on`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `I smiled and she said, 'You mean you want me to-'`, opt)
        .res,
      `I smiled and she said, 'You mean you want me to&mdash;'`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`17 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities on`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
    convertApostrophes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `I smiled and she said, 'You mean you want me to-'`, opt)
        .res,
      `I smiled and she said, &lsquo;You mean you want me to-&rsquo;`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`18 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities on`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `I smiled and she said, 'You mean you want me to-'`, opt)
        .res,
      `I smiled and she said, 'You mean you want me to-'`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`19 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities off`, () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDashes: true,
    convertApostrophes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `I smiled and she said, 'You mean you want me to-'`, opt)
        .res,
      `I smiled and she said, ${leftSingleQuote}You mean you want me to${rawMDash}${rightSingleQuote}`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`20 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities off`, () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDashes: true,
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `I smiled and she said, 'You mean you want me to-'`, opt)
        .res,
      `I smiled and she said, 'You mean you want me to${rawMDash}'`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`21 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities off`, () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDashes: false,
    convertApostrophes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `I smiled and she said, 'You mean you want me to-'`, opt)
        .res,
      `I smiled and she said, ${leftSingleQuote}You mean you want me to-${rightSingleQuote}`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`22 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities off`, () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDashes: false,
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `I smiled and she said, 'You mean you want me to-'`, opt)
        .res,
      `I smiled and she said, 'You mean you want me to-'`,
      JSON.stringify(opt, null, 4)
    );
  });
});

// options are explicit:
// "off" means there won't be any m-dashes - any findings will be converted to hyphens
// "on" means there will be only m-dashes (where applicable)

test(`23 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`, () => {
  let res = `a &mdash; b`;
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, `a - b`, opt).res, res, JSON.stringify(opt, null, 4));
  });
});

test(`24 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    ok(det(ok, not, n, `a - b`, opt).applicableOpts.convertDashes);
  });
});

test(`25 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`, () => {
  let res = `a &mdash; b`;
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a &ndash; b`, opt).res,
      res,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`26 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    ok(det(ok, not, n, `a &ndash; b`, opt).applicableOpts.convertDashes);
  });
});

test(`27 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`, () => {
  let res = `a &mdash; b`;
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a &mdash; b`, opt).res,
      res,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`28 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    ok(det(ok, not, n, `a &mdash; b`, opt).applicableOpts.convertDashes);
  });
});

test(`29 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`, () => {
  let res = `a &mdash; b`;
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawNDash} b`, opt).res,
      res,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`30 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    ok(det(ok, not, n, `a ${rawNDash} b`, opt).applicableOpts.convertDashes);
  });
});

test(`31 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`, () => {
  let res = `a &mdash; b`;
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawMDash} b`, opt).res,
      res,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`32 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    ok(det(ok, not, n, `a ${rawMDash} b`, opt).applicableOpts.convertDashes);
  });
});

test(`33 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}, numerically-encoded dash`, () => {
  let res = `a &mdash; b`;
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    // dash
    equal(
      det(ok, not, n, `a &#x2D; b`, opt).res,
      res,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`34 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}, numerically-encoded dash`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    ok(det(ok, not, n, `a &#x2D; b`, opt).applicableOpts.convertDashes);
  });
});

test(`35 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}, numerically-encoded n-dash`, () => {
  let res = `a &mdash; b`;
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    // numeric entity, n-dash
    equal(
      det(ok, not, n, `a &#x2013; b`, opt).res,
      res,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`36 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}, numerically-encoded n-dash`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    ok(det(ok, not, n, `a &#x2013; b`, opt).applicableOpts.convertDashes);
  });
});

test(`37 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}, numerically-encoded m-dash`, () => {
  let res = `a &mdash; b`;
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    // numeric entity, m-dash
    equal(
      det(ok, not, n, `a &#x2014; b`, opt).res,
      res,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`38 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${`on`}\u001b[${39}m`}, numerically-encoded m-dash`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    ok(det(ok, not, n, `a &#x2014; b`, opt).applicableOpts.convertDashes);
  });
});

test(`39 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`, () => {
  let res = `a - b`;
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, `a - b`, opt).res, res, JSON.stringify(opt, null, 4));
  });
});

test(`40 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    ok(det(ok, not, n, `a - b`, opt).applicableOpts.convertDashes);
  });
});

test(`41 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`, () => {
  let res = `a - b`;
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a &ndash; b`, opt).res,
      res,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`42 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    ok(det(ok, not, n, `a &ndash; b`, opt).applicableOpts.convertDashes);
  });
});

test(`43 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`, () => {
  let res = `a - b`;
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a &mdash; b`, opt).res,
      res,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`44 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    ok(det(ok, not, n, `a &mdash; b`, opt).applicableOpts.convertDashes);
  });
});

test(`45 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`, () => {
  let res = `a - b`;
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawNDash} b`, opt).res,
      res,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`46 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    ok(det(ok, not, n, `a ${rawNDash} b`, opt).applicableOpts.convertDashes);
  });
});

test(`47 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`, () => {
  let res = `a - b`;
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawMDash} b`, opt).res,
      res,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`48 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    ok(det(ok, not, n, `a ${rawMDash} b`, opt).applicableOpts.convertDashes);
  });
});

test(`49 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}, numerically-encoded dash`, () => {
  let res = `a - b`;
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a &#x2D; b`, opt).res,
      res,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`50 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}, numerically-encoded dash`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    ok(det(ok, not, n, `a &#x2D; b`, opt).applicableOpts.convertDashes);
  });
});

test(`51 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}, numerically-encoded n-dash`, () => {
  let res = `a - b`;
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    // n-dash
    equal(
      det(ok, not, n, `a &#x2013; b`, opt).res,
      res,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`52 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}, numerically-encoded n-dash`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    ok(det(ok, not, n, `a &#x2013; b`, opt).applicableOpts.convertDashes);
  });
});

test(`53 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}, numerically-encoded m-dash`, () => {
  let res = `a - b`;
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    // m-dash
    equal(
      det(ok, not, n, `a &#x2014; b`, opt).res,
      res,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`54 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${`off`}\u001b[${39}m`}, numerically-encoded m-dash`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    ok(det(ok, not, n, `a &#x2014; b`, opt).applicableOpts.convertDashes);
  });
});

test(`55 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - quick ad-hoc 1`, () => {
  equal(det1(`abc def ghi jkl`).res, "abc def ghi&nbsp;jkl", "55.01");
});

test(`56 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - dash conversion off, widow removal on`, () => {
  equal(
    det1(`a &ndash; b`, {
      removeWidows: true,
      convertEntities: true,
      convertDashes: false,
    }).res,
    `a&nbsp;- b`,
    "56.01"
  );
});

//                              insurance
// -----------------------------------------------------------------------------

test(`57 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - if statements`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "zzz{% if something %}yyy", opt).res,
      "zzz{% if something %}yyy",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`58 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - variables`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "zzz{{ something }}yyy", opt).res,
      "zzz{{ something }}yyy",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`59 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - if statements`, () => {
  mixer().forEach((opt, n) => {
    // with Nunjucks whitespace collapse hyphen:
    equal(
      det(ok, not, n, "zzz{%- if something -%}yyy", opt).res,
      "zzz{%- if something -%}yyy",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`60 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - collapsing variables`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "zzz{{- something -}}yyy", opt).res,
      "zzz{{- something -}}yyy",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`61 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - raw m-dash sanity check`, () => {
  mixer({
    convertEntities: false,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `m${rawMDash}m`, opt).res,
      `m${rawMDash}m`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `m${rawMDash}m`, opt).res,
      `m-m`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`62 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - leaves minuses alone with convert entities option off`, () => {
  mixer({
    convertEntities: false,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "m-m", opt).res, "m-m", JSON.stringify(opt, null, 4));
  });
});

test(`63 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - leaves the m-dashes intact`, () => {
  mixer({
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `m${rawMDash}m`, opt).res,
      "m&mdash;m",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `m${rawMDash}m`, opt).res,
      "m-m",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`64 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 1`, () => {
  let source = `{% if x %}a{% endif %} a &mdash; b`;
  mixer({
    removeWidows: true,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det1(source, opt).res,
      "{% if x %}a{% endif %} a&nbsp;&mdash;&nbsp;b"
    );
    equal(
      det(ok, not, n, source, opt).res,
      "{% if x %}a{% endif %} a&nbsp;&mdash;&nbsp;b",
      JSON.stringify(opt, null, 4)
    );
    ok(det(ok, not, n, source, opt).applicableOpts.convertDashes);
  });
});

test(`65 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 2`, () => {
  let source = `{% if x %}a{% endif %} a &mdash; b`;
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, source, opt).res,
      source,
      JSON.stringify(opt, null, 4)
    );
    ok(det(ok, not, n, source, opt).applicableOpts.convertDashes);
  });
});

test(`66 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 3`, () => {
  let source = `{% if x %}a{% endif %} a &mdash; b`;
  mixer({
    removeWidows: true,
    convertEntities: false,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, source, opt).res,
      `{% if x %}a{% endif %} a${rawNbsp}${rawMDash}${rawNbsp}b`,
      JSON.stringify(opt, null, 4)
    );
    ok(det(ok, not, n, source, opt).applicableOpts.convertDashes);
  });
});

test(`67 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 4`, () => {
  let source = `{% if x %}a{% endif %} a &mdash; b`;
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, source, opt).res,
      `{% if x %}a{% endif %} a ${rawMDash} b`,
      JSON.stringify(opt, null, 4)
    );
    ok(det(ok, not, n, source, opt).applicableOpts.convertDashes);
  });
});

test(`68 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 5`, () => {
  let source = `{% if x %}a{% endif %} a &mdash; b`;
  mixer({
    removeWidows: true,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, source, opt).res,
      "{% if x %}a{% endif %} a&nbsp;-&nbsp;b",
      JSON.stringify(opt, null, 4)
    );
    ok(det(ok, not, n, source, opt).applicableOpts.convertDashes);
  });
});

test(`69 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 6`, () => {
  let source = `{% if x %}a{% endif %} a &mdash; b`;
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, source, opt).res,
      `{% if x %}a{% endif %} a - b`,
      JSON.stringify(opt, null, 4)
    );
    ok(det(ok, not, n, source, opt).applicableOpts.convertDashes);
  });
});

test(`70 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 7`, () => {
  let source = `{% if x %}a{% endif %} a &mdash; b`;
  mixer({
    removeWidows: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, source, opt).res,
      `{% if x %}a{% endif %} a${rawNbsp}-${rawNbsp}b`,
      JSON.stringify(opt, null, 4)
    );
    ok(det(ok, not, n, source, opt).applicableOpts.convertDashes);
  });
});

test(`71 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 8`, () => {
  let source = `{% if x %}a{% endif %} a &mdash; b`;
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, source, opt).res,
      `{% if x %}a{% endif %} a - b`,
      JSON.stringify(opt, null, 4)
    );
    ok(det(ok, not, n, source, opt).applicableOpts.convertDashes);
  });
});

//                                 minuses
// -----------------------------------------------------------------------------

test(`72 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - leaves minuses alone with convert entities option on`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "m-m", opt).res, "m-m", JSON.stringify(opt, null, 4));
  });
});

test(`73 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - legit minus between two numbers`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      // nothing to convert:
      det(ok, not, n, `1 - 2 = 3`, opt).res,
      `1 &ndash; 2 = 3`,
      "73.01"
    );
  });
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      // nothing to convert:
      det(ok, not, n, `1 - 2 = 3`, opt).res,
      `1 ${rawNDash} 2 = 3`,
      "73.02"
    );
  });
  mixer({
    removeWidows: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      // nothing to convert:
      det(ok, not, n, `1 - 2 = 3`, opt).res,
      `1 - 2 = 3`,
      "73.03"
    );
  });
});

test(`74 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - minus and number, too short to widow removal`, () => {
  mixer({
    convertEntities: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Temperatures of -20°C", opt).res,
      "Temperatures of -20°C"
    );
    equal(
      det(ok, not, n, "-20°C", opt).res,
      "-20°C",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`75 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - deg HTML entity`, () => {
  mixer({
    convertEntities: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Temperatures of -20°C", opt).res,
      "Temperatures of -20&deg;C"
    );
    equal(
      det(ok, not, n, "-20°C", opt).res,
      "-20&deg;C",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`76 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - deg HTML entity in a sentence - widows=on`, () => {
  mixer({
    convertEntities: true,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "The records show that there were temperatures as low as -20°C",
        opt
      ).res,
      "The records show that there were temperatures as low as&nbsp;-20&deg;C",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`77 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - deg HTML entity in a sentence - widows=off`, () => {
  mixer({
    convertEntities: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "The records show that there were temperatures as low as -20°C",
        opt
      ).res,
      "The records show that there were temperatures as low as -20&deg;C",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`78 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - minus and number, clashing with widow removal - widows=on, entities=off`, () => {
  mixer({
    convertEntities: false,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "The records show that there were temperatures as low as -20°C",
        opt
      ).res,
      "The records show that there were temperatures as low as\u00A0-20°C",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`79 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - minus and number, clashing with widow removal - widows=off, entities=off`, () => {
  mixer({
    convertEntities: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "The records show that there were temperatures as low as -20°C",
        opt
      ).res,
      "The records show that there were temperatures as low as -20°C",
      JSON.stringify(opt, null, 4)
    );
  });
});

//                                 hyphens
// -----------------------------------------------------------------------------

test(`80 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - no full stop`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "Stratford-upon-Avon", opt).res,
      "Stratford-upon-Avon",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`81 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - no full stop, longer sentence`, () => {
  mixer({
    convertEntities: true,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "One day we should visit Stratford-upon-Avon", opt).res,
      "One day we should visit&nbsp;Stratford-upon-Avon",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`82 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - full stop`, () => {
  mixer({
    convertEntities: true,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "One day we should visit Stratford-upon-Avon.", opt).res,
      "One day we should visit&nbsp;Stratford-upon-Avon.",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`83 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - no full stop, widows=off`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "One day we should visit Stratford-upon-Avon", opt).res,
      "One day we should visit Stratford-upon-Avon",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`84 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - full stop, widows=off`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "One day we should visit Stratford-upon-Avon.", opt).res,
      "One day we should visit Stratford-upon-Avon.",
      JSON.stringify(opt, null, 4)
    );
  });
});

test.skip(`85 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - when dashes are off, widow removal still works`, () => {
  equal(
    det1("a - b", {
      removeWidows: true,
      convertEntities: true,
      convertDashes: false,
    }).res,
    `a&nbsp;- b`,
    "85.01"
  );
  ok(
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
    equal(
      det(ok, not, n, "One day - and I mean some day - we will travel", opt)
        .res,
      `One day&nbsp;- and I mean some day&nbsp;- we will&nbsp;travel`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test.run();
