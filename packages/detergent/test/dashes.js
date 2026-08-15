// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import {
  // rightDoubleQuote,
  // leftDoubleQuote,
  leftSingleQuote,
  rawMDash,
  rawNbsp,
  // rawReplacementMark,
  rawNDash,
  // hairspace,
  // ellipsis,
  rightSingleQuote,
} from "codsen-utils";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

// -----------------------------------------------------------------------------

// following test is according to the Butterick's practical typography
// http://practicaltypography.com/hyphens-and-dashes.html
test(`001 - opts.convertDashes - \u001b[${33}m${"n-dash"}\u001b[${39}m - converts dashes into N dashes: +dashes+entities-widows`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "1880-1912, pages 330-39", opt).res,
      "1880&ndash;1912, pages 330&ndash;39",
      "001.01",
    );
  });
});

test(`002 - opts.convertDashes - \u001b[${33}m${"n-dash"}\u001b[${39}m - converts dashes into N dashes: +dashes-entities-widows`, () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "1880-1912, pages 330-39", opt).res,
      "1880\u20131912, pages 330\u201339",
      "002.01",
    );
  });
});

test(`003 - opts.convertDashes - \u001b[${33}m${"n-dash"}\u001b[${39}m - doesn't convert N dashes when is not asked to: -dashes-widows`, () => {
  mixer({
    convertDashes: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "1880-1912, pages 330-39", opt).res,
      "1880-1912, pages 330-39",
      "003.01",
    );
  });
});

// example from Oxford A-Z Grammar and Punctuation
test(`004 - opts.convertDashes - \u001b[${33}m${"n-dash"}\u001b[${39}m - A-Z - hyphen`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "An A-Z guide", opt).res,
      "An A&ndash;Z guide",
      "004.01",
    );
  });
  mixer({
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "An A-Z guide", opt).res,
      "An A\u2013Z guide",
      "004.02",
    );
  });
  mixer({
    convertDashes: false,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "An A-Z guide", opt).res, "An A-Z guide", "004.03");
  });
});

test(`005 - opts.convertDashes - \u001b[${33}m${"n-dash"}\u001b[${39}m - A-Z - raw n-dash`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `An A${rawNDash}Z guide`, opt).res,
      "An A&ndash;Z guide",
      "005.01",
    );
  });
  mixer({
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `An A${rawNDash}Z guide`, opt).res,
      `An A${rawNDash}Z guide`,
      "005.02",
    );
  });
  mixer({
    convertDashes: false,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `An A${rawNDash}Z guide`, opt).res,
      "An A-Z guide",
      "005.03",
    );
  });
});

test(`006 - opts.convertDashes - \u001b[${33}m${"n-dash"}\u001b[${39}m - A-Z - encoded n-dash`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "An A&ndash;Z guide", opt).res,
      "An A&ndash;Z guide",
      "006.01",
    );
  });
  mixer({
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "An A&ndash;Z guide", opt).res,
      `An A${rawNDash}Z guide`,
      "006.02",
    );
  });
  mixer({
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "An A&ndash;Z guide", opt).res,
      "An A-Z guide",
      "006.03",
    );
  });
});

//                                 m dashes
// -----------------------------------------------------------------------------

test(`007 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - converts with encoding entities: +dashes-widows+entities`, () => {
  mixer({
    convertDashes: true,
    removeWidows: false,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "some text - some more text", opt).res,
      "some text &mdash; some more text",
      "007.01",
    );
  });
});

test(`008 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - converts without encoding entities: +dashes-widows-entities`, () => {
  mixer({
    convertDashes: true,
    removeWidows: false,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "some text - some more text", opt).res,
      `some text ${rawMDash} some more text`,
      "008.01",
    );
  });
});

test(`009 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - does not convert: -dashes-widows`, () => {
  mixer({
    convertDashes: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "some text - some more text", opt).res,
      "some text - some more text",
      "009.01",
    );
  });
});

// example adapted from Oxford A-Z Grammar and Punctuation, p.46
test(`010 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - adds between two words`, () => {
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
        opt,
      ).res,
      `In brute material terms, he was an accomplice ${rawMDash} in fact, a conspirator ${rawMDash} to the clearing of the ice-cream fridge.`,
      "010.01",
    );
  });
});

test(`011 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - direct speech breaks off - curly - convert entities on`, () => {
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
        opt,
      ).res,
      "I smiled and she said, &lsquo;You mean you want me to&mdash;&rsquo;",
      "011.01",
    );
  });
});

test(`012 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - direct speech breaks off - curly - convert entities off`, () => {
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
        opt,
      ).res,
      `I smiled and she said, ${leftSingleQuote}You mean you want me to${rawMDash}${rightSingleQuote}`,
      "012.01",
    );
  });
});

test(`013 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - direct speech breaks off - curly - convert entities on`, () => {
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
        opt,
      ).res,
      "I smiled and she said, 'You mean you want me to&mdash;'",
      "013.01",
    );
  });
});

test(`014 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - direct speech breaks off - curly - convert entities off`, () => {
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
        opt,
      ).res,
      `I smiled and she said, 'You mean you want me to${rawMDash}'`,
      "014.01",
    );
  });
});

test(`015 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - direct speech breaks off - straight - convert entities on`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
    convertApostrophes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "I smiled and she said, 'You mean you want me to-'", opt)
        .res,
      "I smiled and she said, &lsquo;You mean you want me to&mdash;&rsquo;",
      "015.01",
    );
  });
});

test(`016 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - direct speech breaks off - straight - convert entities on`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "I smiled and she said, 'You mean you want me to-'", opt)
        .res,
      "I smiled and she said, 'You mean you want me to&mdash;'",
      "016.01",
    );
  });
});

test(`017 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - direct speech breaks off - straight - convert entities on`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
    convertApostrophes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "I smiled and she said, 'You mean you want me to-'", opt)
        .res,
      "I smiled and she said, &lsquo;You mean you want me to-&rsquo;",
      "017.01",
    );
  });
});

test(`018 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - direct speech breaks off - straight - convert entities on`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "I smiled and she said, 'You mean you want me to-'", opt)
        .res,
      "I smiled and she said, 'You mean you want me to-'",
      "018.01",
    );
  });
});

test(`019 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - direct speech breaks off - straight - convert entities off`, () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDashes: true,
    convertApostrophes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "I smiled and she said, 'You mean you want me to-'", opt)
        .res,
      `I smiled and she said, ${leftSingleQuote}You mean you want me to${rawMDash}${rightSingleQuote}`,
      "019.01",
    );
  });
});

test(`020 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - direct speech breaks off - straight - convert entities off`, () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDashes: true,
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "I smiled and she said, 'You mean you want me to-'", opt)
        .res,
      `I smiled and she said, 'You mean you want me to${rawMDash}'`,
      "020.01",
    );
  });
});

test(`021 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - direct speech breaks off - straight - convert entities off`, () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDashes: false,
    convertApostrophes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "I smiled and she said, 'You mean you want me to-'", opt)
        .res,
      `I smiled and she said, ${leftSingleQuote}You mean you want me to-${rightSingleQuote}`,
      "021.01",
    );
  });
});

test(`022 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - direct speech breaks off - straight - convert entities off`, () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDashes: false,
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "I smiled and she said, 'You mean you want me to-'", opt)
        .res,
      "I smiled and she said, 'You mean you want me to-'",
      "022.01",
    );
  });
});

// options are explicit:
// "off" means there won't be any m-dashes - any findings will be converted to hyphens
// "on" means there will be only m-dashes (where applicable)

test(`023 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${"on"}\u001b[${39}m`}`, () => {
  let res = "a &mdash; b";
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "a - b", opt).res, res, "023.01");
  });
});

test(`024 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${"on"}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    ok(det(ok, not, n, "a - b", opt).applicableOpts.convertDashes, "024.01");
  });
});

test(`025 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${"on"}\u001b[${39}m`}`, () => {
  let res = "a &mdash; b";
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "a &ndash; b", opt).res, res, "025.01");
  });
});

test(`026 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${"on"}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    ok(
      det(ok, not, n, "a &ndash; b", opt).applicableOpts.convertDashes,
      "026.01",
    );
  });
});

test(`027 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${"on"}\u001b[${39}m`}`, () => {
  let res = "a &mdash; b";
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "a &mdash; b", opt).res, res, "027.01");
  });
});

test(`028 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${"on"}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    ok(
      det(ok, not, n, "a &mdash; b", opt).applicableOpts.convertDashes,
      "028.01",
    );
  });
});

test(`029 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${"on"}\u001b[${39}m`}`, () => {
  let res = "a &mdash; b";
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, `a ${rawNDash} b`, opt).res, res, "029.01");
  });
});

test(`030 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${"on"}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    ok(
      det(ok, not, n, `a ${rawNDash} b`, opt).applicableOpts.convertDashes,
      "030.01",
    );
  });
});

test(`031 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${"on"}\u001b[${39}m`}`, () => {
  let res = "a &mdash; b";
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, `a ${rawMDash} b`, opt).res, res, "031.01");
  });
});

test(`032 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${"on"}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    ok(
      det(ok, not, n, `a ${rawMDash} b`, opt).applicableOpts.convertDashes,
      "032.01",
    );
  });
});

test(`033 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${"on"}\u001b[${39}m`}, numerically-encoded dash`, () => {
  let res = "a &mdash; b";
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    // dash
    equal(det(ok, not, n, "a &#x2D; b", opt).res, res, "033.01");
  });
});

test(`034 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${"on"}\u001b[${39}m`}, numerically-encoded dash`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    ok(
      det(ok, not, n, "a &#x2D; b", opt).applicableOpts.convertDashes,
      "034.01",
    );
  });
});

test(`035 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${"on"}\u001b[${39}m`}, numerically-encoded n-dash`, () => {
  let res = "a &mdash; b";
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    // numeric entity, n-dash
    equal(det(ok, not, n, "a &#x2013; b", opt).res, res, "035.01");
  });
});

test(`036 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${"on"}\u001b[${39}m`}, numerically-encoded n-dash`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    ok(
      det(ok, not, n, "a &#x2013; b", opt).applicableOpts.convertDashes,
      "036.01",
    );
  });
});

test(`037 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${"on"}\u001b[${39}m`}, numerically-encoded m-dash`, () => {
  let res = "a &mdash; b";
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    // numeric entity, m-dash
    equal(det(ok, not, n, "a &#x2014; b", opt).res, res, "037.01");
  });
});

test(`038 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${32}m${"on"}\u001b[${39}m`}, numerically-encoded m-dash`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    ok(
      det(ok, not, n, "a &#x2014; b", opt).applicableOpts.convertDashes,
      "038.01",
    );
  });
});

test(`039 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${"off"}\u001b[${39}m`}`, () => {
  let res = "a - b";
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "a - b", opt).res, res, "039.01");
  });
});

test(`040 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${"off"}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    ok(det(ok, not, n, "a - b", opt).applicableOpts.convertDashes, "040.01");
  });
});

test(`041 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${"off"}\u001b[${39}m`}`, () => {
  let res = "a - b";
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "a &ndash; b", opt).res, res, "041.01");
  });
});

test(`042 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${"off"}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    ok(
      det(ok, not, n, "a &ndash; b", opt).applicableOpts.convertDashes,
      "042.01",
    );
  });
});

test(`043 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${"off"}\u001b[${39}m`}`, () => {
  let res = "a - b";
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "a &mdash; b", opt).res, res, "043.01");
  });
});

test(`044 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${"off"}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    ok(
      det(ok, not, n, "a &mdash; b", opt).applicableOpts.convertDashes,
      "044.01",
    );
  });
});

test(`045 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${"off"}\u001b[${39}m`}`, () => {
  let res = "a - b";
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, `a ${rawNDash} b`, opt).res, res, "045.01");
  });
});

test(`046 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${"off"}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    ok(
      det(ok, not, n, `a ${rawNDash} b`, opt).applicableOpts.convertDashes,
      "046.01",
    );
  });
});

test(`047 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${"off"}\u001b[${39}m`}`, () => {
  let res = "a - b";
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, `a ${rawMDash} b`, opt).res, res, "047.01");
  });
});

test(`048 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${"off"}\u001b[${39}m`}`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    ok(
      det(ok, not, n, `a ${rawMDash} b`, opt).applicableOpts.convertDashes,
      "048.01",
    );
  });
});

test(`049 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${"off"}\u001b[${39}m`}, numerically-encoded dash`, () => {
  let res = "a - b";
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "a &#x2D; b", opt).res, res, "049.01");
  });
});

test(`050 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${"off"}\u001b[${39}m`}, numerically-encoded dash`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    ok(
      det(ok, not, n, "a &#x2D; b", opt).applicableOpts.convertDashes,
      "050.01",
    );
  });
});

test(`051 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${"off"}\u001b[${39}m`}, numerically-encoded n-dash`, () => {
  let res = "a - b";
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    // n-dash
    equal(det(ok, not, n, "a &#x2013; b", opt).res, res, "051.01");
  });
});

test(`052 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${"off"}\u001b[${39}m`}, numerically-encoded n-dash`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    ok(
      det(ok, not, n, "a &#x2013; b", opt).applicableOpts.convertDashes,
      "052.01",
    );
  });
});

test(`053 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${"off"}\u001b[${39}m`}, numerically-encoded m-dash`, () => {
  let res = "a - b";
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    // m-dash
    equal(det(ok, not, n, "a &#x2014; b", opt).res, res, "053.01");
  });
});

test(`054 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - opts are interpreted explicitly - convertDashes=${`\u001b[${31}m${"off"}\u001b[${39}m`}, numerically-encoded m-dash`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    ok(
      det(ok, not, n, "a &#x2014; b", opt).applicableOpts.convertDashes,
      "054.01",
    );
  });
});

test(`055 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - quick ad-hoc 1`, () => {
  equal(det1("abc def ghi jkl").res, "abc def ghi&nbsp;jkl", "055.01");
});

test(`056 - opts.convertDashes - \u001b[${31}m${"m-dash"}\u001b[${39}m - dash conversion off, widow removal on`, () => {
  equal(
    det1("a &ndash; b", {
      removeWidows: true,
      convertEntities: true,
      convertDashes: false,
    }).res,
    "a&nbsp;- b",
    "056.01",
  );
});

//                              insurance
// -----------------------------------------------------------------------------

test(`057 - opts.convertDashes - \u001b[${33}m${"insurance"}\u001b[${39}m - Jinja/Nunjucks code - if statements`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "zzz{% if something %}yyy", opt).res,
      "zzz{% if something %}yyy",
      "057.01",
    );
  });
});

test(`058 - opts.convertDashes - \u001b[${33}m${"insurance"}\u001b[${39}m - Jinja/Nunjucks code - variables`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "zzz{{ something }}yyy", opt).res,
      "zzz{{ something }}yyy",
      "058.01",
    );
  });
});

test(`059 - opts.convertDashes - \u001b[${33}m${"insurance"}\u001b[${39}m - Jinja/Nunjucks code - if statements`, () => {
  mixer().forEach((opt, n) => {
    // with Nunjucks whitespace collapse hyphen:
    equal(
      det(ok, not, n, "zzz{%- if something -%}yyy", opt).res,
      "zzz{%- if something -%}yyy",
      "059.01",
    );
  });
});

test(`060 - opts.convertDashes - \u001b[${33}m${"insurance"}\u001b[${39}m - Jinja/Nunjucks code - collapsing variables`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "zzz{{- something -}}yyy", opt).res,
      "zzz{{- something -}}yyy",
      "060.01",
    );
  });
});

test(`061 - opts.convertDashes - \u001b[${33}m${"insurance"}\u001b[${39}m - raw m-dash sanity check`, () => {
  mixer({
    convertEntities: false,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, `m${rawMDash}m`, opt).res, `m${rawMDash}m`, "061.01");
  });
  mixer({
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, `m${rawMDash}m`, opt).res, "m-m", "061.02");
  });
});

test(`062 - opts.convertDashes - \u001b[${33}m${"insurance"}\u001b[${39}m - leaves minuses alone with convert entities option off`, () => {
  mixer({
    convertEntities: false,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "m-m", opt).res, "m-m", "062.01");
  });
});

test(`063 - opts.convertDashes - \u001b[${33}m${"insurance"}\u001b[${39}m - leaves the m-dashes intact`, () => {
  mixer({
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, `m${rawMDash}m`, opt).res, "m&mdash;m", "063.01");
  });
  mixer({
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, `m${rawMDash}m`, opt).res, "m-m", "063.02");
  });
});

test(`064 - opts.convertDashes - \u001b[${33}m${"insurance"}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 1`, () => {
  let source = "{% if x %}a{% endif %} a &mdash; b";
  mixer({
    removeWidows: true,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det1(source, opt).res,
      "{% if x %}a{% endif %} a&nbsp;&mdash;&nbsp;b",
      "064.01",
    );
    equal(
      det(ok, not, n, source, opt).res,
      "{% if x %}a{% endif %} a&nbsp;&mdash;&nbsp;b",
      "064.02",
    );
    ok(det(ok, not, n, source, opt).applicableOpts.convertDashes, "064.03");
  });
});

test(`065 - opts.convertDashes - \u001b[${33}m${"insurance"}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 2`, () => {
  let source = "{% if x %}a{% endif %} a &mdash; b";
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, source, opt).res, source, "065.01");
    ok(det(ok, not, n, source, opt).applicableOpts.convertDashes, "065.02");
  });
});

test(`066 - opts.convertDashes - \u001b[${33}m${"insurance"}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 3`, () => {
  let source = "{% if x %}a{% endif %} a &mdash; b";
  mixer({
    removeWidows: true,
    convertEntities: false,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, source, opt).res,
      `{% if x %}a{% endif %} a${rawNbsp}${rawMDash}${rawNbsp}b`,
      "066.01",
    );
    ok(det(ok, not, n, source, opt).applicableOpts.convertDashes, "066.02");
  });
});

test(`067 - opts.convertDashes - \u001b[${33}m${"insurance"}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 4`, () => {
  let source = "{% if x %}a{% endif %} a &mdash; b";
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, source, opt).res,
      `{% if x %}a{% endif %} a ${rawMDash} b`,
      "067.01",
    );
    ok(det(ok, not, n, source, opt).applicableOpts.convertDashes, "067.02");
  });
});

test(`068 - opts.convertDashes - \u001b[${33}m${"insurance"}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 5`, () => {
  let source = "{% if x %}a{% endif %} a &mdash; b";
  mixer({
    removeWidows: true,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, source, opt).res,
      "{% if x %}a{% endif %} a&nbsp;-&nbsp;b",
      "068.01",
    );
    ok(det(ok, not, n, source, opt).applicableOpts.convertDashes, "068.02");
  });
});

test(`069 - opts.convertDashes - \u001b[${33}m${"insurance"}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 6`, () => {
  let source = "{% if x %}a{% endif %} a &mdash; b";
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, source, opt).res,
      "{% if x %}a{% endif %} a - b",
      "069.01",
    );
    ok(det(ok, not, n, source, opt).applicableOpts.convertDashes, "069.02");
  });
});

test(`070 - opts.convertDashes - \u001b[${33}m${"insurance"}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 7`, () => {
  let source = "{% if x %}a{% endif %} a &mdash; b";
  mixer({
    removeWidows: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, source, opt).res,
      `{% if x %}a{% endif %} a${rawNbsp}-${rawNbsp}b`,
      "070.01",
    );
    ok(det(ok, not, n, source, opt).applicableOpts.convertDashes, "070.02");
  });
});

test(`071 - opts.convertDashes - \u001b[${33}m${"insurance"}\u001b[${39}m - reporting of M-dashes that follow nunj IF-ELSE blocks 8`, () => {
  let source = "{% if x %}a{% endif %} a &mdash; b";
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, source, opt).res,
      "{% if x %}a{% endif %} a - b",
      "071.01",
    );
    ok(det(ok, not, n, source, opt).applicableOpts.convertDashes, "071.02");
  });
});

//                                 minuses
// -----------------------------------------------------------------------------

test(`072 - opts.convertDashes - \u001b[${36}m${"minuses"}\u001b[${39}m - leaves minuses alone with convert entities option on`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "m-m", opt).res, "m-m", "072.01");
  });
});

test(`073 - opts.convertDashes - \u001b[${36}m${"minuses"}\u001b[${39}m - legit minus between two numbers`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      // nothing to convert:
      det(ok, not, n, "1 - 2 = 3", opt).res,
      "1 &ndash; 2 = 3",
      "073.01",
    );
  });
  mixer({
    removeWidows: false,
    convertEntities: false,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      // nothing to convert:
      det(ok, not, n, "1 - 2 = 3", opt).res,
      `1 ${rawNDash} 2 = 3`,
      "073.02",
    );
  });
  mixer({
    removeWidows: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      // nothing to convert:
      det(ok, not, n, "1 - 2 = 3", opt).res,
      "1 - 2 = 3",
      "073.03",
    );
  });
});

test(`074 - opts.convertDashes - \u001b[${36}m${"minuses"}\u001b[${39}m - minus and number, too short to widow removal`, () => {
  mixer({
    convertEntities: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Temperatures of -20°C", opt).res,
      "Temperatures of -20°C",
      "074.01",
    );
    equal(det(ok, not, n, "-20°C", opt).res, "-20°C", "074.02");
  });
});

test(`075 - opts.convertDashes - \u001b[${36}m${"minuses"}\u001b[${39}m - deg HTML entity`, () => {
  mixer({
    convertEntities: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Temperatures of -20°C", opt).res,
      "Temperatures of -20&deg;C",
      "075.01",
    );
    equal(det(ok, not, n, "-20°C", opt).res, "-20&deg;C", "075.02");
  });
});

test(`076 - opts.convertDashes - \u001b[${36}m${"minuses"}\u001b[${39}m - deg HTML entity in a sentence - widows=on`, () => {
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
        opt,
      ).res,
      "The records show that there were temperatures as low as&nbsp;-20&deg;C",
      "076.01",
    );
  });
});

test(`077 - opts.convertDashes - \u001b[${36}m${"minuses"}\u001b[${39}m - deg HTML entity in a sentence - widows=off`, () => {
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
        opt,
      ).res,
      "The records show that there were temperatures as low as -20&deg;C",
      "077.01",
    );
  });
});

test(`078 - opts.convertDashes - \u001b[${36}m${"minuses"}\u001b[${39}m - minus and number, clashing with widow removal - widows=on, entities=off`, () => {
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
        opt,
      ).res,
      "The records show that there were temperatures as low as\u00A0-20°C",
      "078.01",
    );
  });
});

test(`079 - opts.convertDashes - \u001b[${36}m${"minuses"}\u001b[${39}m - minus and number, clashing with widow removal - widows=off, entities=off`, () => {
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
        opt,
      ).res,
      "The records show that there were temperatures as low as -20°C",
      "079.01",
    );
  });
});

//                                 hyphens
// -----------------------------------------------------------------------------

test(`080 - opts.convertDashes - \u001b[${36}m${"hyphens"}\u001b[${39}m - dashes between words, no spaces - no full stop`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "Stratford-upon-Avon", opt).res,
      "Stratford-upon-Avon",
      "080.01",
    );
  });
});

test(`081 - opts.convertDashes - \u001b[${36}m${"hyphens"}\u001b[${39}m - dashes between words, no spaces - no full stop, longer sentence`, () => {
  mixer({
    convertEntities: true,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "One day we should visit Stratford-upon-Avon", opt).res,
      "One day we should visit&nbsp;Stratford-upon-Avon",
      "081.01",
    );
  });
});

test(`082 - opts.convertDashes - \u001b[${36}m${"hyphens"}\u001b[${39}m - dashes between words, no spaces - full stop`, () => {
  mixer({
    convertEntities: true,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "One day we should visit Stratford-upon-Avon.", opt).res,
      "One day we should visit&nbsp;Stratford-upon-Avon.",
      "082.01",
    );
  });
});

test(`083 - opts.convertDashes - \u001b[${36}m${"hyphens"}\u001b[${39}m - dashes between words, no spaces - no full stop, widows=off`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "One day we should visit Stratford-upon-Avon", opt).res,
      "One day we should visit Stratford-upon-Avon",
      "083.01",
    );
  });
});

test(`084 - opts.convertDashes - \u001b[${36}m${"hyphens"}\u001b[${39}m - dashes between words, no spaces - full stop, widows=off`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "One day we should visit Stratford-upon-Avon.", opt).res,
      "One day we should visit Stratford-upon-Avon.",
      "084.01",
    );
  });
});

test(`085 - \u001b[${35}m${"opts.convertDashes"}\u001b[${39}m - \u001b[${36}m${"hyphens"}\u001b[${39}m - when dashes are off, widow removal still works`, () => {
  equal(
    det1("a - b", {
      removeWidows: true,
      convertEntities: true,
      convertDashes: false,
    }).res,
    "a&nbsp;- b",
    "085.01",
  );
  ok(
    det1("a - b", {
      removeWidows: false,
      convertEntities: false,
      convertDashes: false,
    }).applicableOpts.removeWidows,
    "085.02",
  );

  mixer({
    removeWidows: true,
    convertEntities: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "One day - and I mean some day - we will travel", opt)
        .res,
      "One day&nbsp;- and I mean some day&nbsp;- we will&nbsp;travel",
      "085.03",
    );
  });
});

test.run();
