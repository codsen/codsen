import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import he from "he";

import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";
import {
  rawReplacementMark,
  // rawNDash,
  rawMDash,
  rawNbsp,
  hairspace,
  // ellipsis,
  rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  leftSingleQuote,
} from "codsen-utils";

// 01. opts.convertEntities
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${31}m${`opts.convertEntities`}\u001b[${39}m`} - pound - convertEntities=on`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `\u00A3`, opt).res,
      "&pound;",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`02 - ${`\u001b[${31}m${`opts.convertEntities`}\u001b[${39}m`} - pound - convertEntities=off`, () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `\u00A3`, opt).res,
      "\u00A3",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`03 - ${`\u001b[${31}m${`opts.convertEntities`}\u001b[${39}m`} - m-dash`, () => {
  mixer({
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `${rawMDash}`, opt).res,
      "&mdash;",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`04 - ${`\u001b[${31}m${`opts.convertEntities`}\u001b[${39}m`} - m-dash`, () => {
  mixer({
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `${rawMDash}`, opt).res,
      "-",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`05 - ${`\u001b[${31}m${`opts.convertEntities`}\u001b[${39}m`} - m-dash`, () => {
  mixer({
    convertEntities: false,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `${rawMDash}`, opt).res,
      `${rawMDash}`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`06 - ${`\u001b[${31}m${`opts.convertEntities`}\u001b[${39}m`} - m-dash`, () => {
  mixer({
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `${rawMDash}`, opt).res,
      `-`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`07 - ${`\u001b[${31}m${`opts.convertEntities`}\u001b[${39}m`} - hairspace`, () => {
  mixer({
    convertEntities: false,
    removeWidows: false,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}&mdash;${hairspace}a`, opt).res,
      `a ${rawMDash} a`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`08 - ${`\u001b[${31}m${`opts.convertEntities`}\u001b[${39}m`} - hairspace`, () => {
  mixer({
    convertDashes: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}&mdash;${hairspace}a`, opt).res,
      `a - a`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`09 - ${`\u001b[${31}m${`opts.convertEntities`}\u001b[${39}m`} - ad hoc 1`, () => {
  equal(
    det1('"', { convertApostrophes: false, convertEntities: true }).res,
    "&quot;",
    "09.01"
  );
});

test(`10 - ${`\u001b[${31}m${`opts.convertEntities`}\u001b[${39}m`} - ad hoc 1`, () => {
  equal(
    det1('^"', { convertApostrophes: false, convertEntities: true }).res,
    "^&quot;",
    "10.01"
  );
});

test(`11 - ${`\u001b[${31}m${`opts.convertEntities`}\u001b[${39}m`} - ad hoc 1`, () => {
  equal(
    det1('^`"', { convertApostrophes: false, convertEntities: true }).res,
    "^`&quot;",
    "11.01"
  );
});

test(`12 - ${`\u001b[${31}m${`opts.convertEntities`}\u001b[${39}m`} - ad hoc 1`, () => {
  mixer({
    convertEntities: true,
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, '^`"', opt).res,
      "^`&quot;",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    convertEntities: true,
    convertApostrophes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, '^`"', opt).res,
      "^`&rdquo;",
      JSON.stringify(opt, null, 4)
    );
  });
});

// 02. mixed cases
// -----------------------------------------------------------------------------

test(`13 - ${`\u001b[${33}m${`opts.convertApostrophes`}\u001b[${39}m`} - mixed #1 - convertApostrophes=on, right single q.`, () => {
  mixer({
    convertEntities: true,
    convertApostrophes: true,
    convertDashes: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `HOORAY  ${rawMDash}  IT${rightSingleQuote}S HERE ${hairspace}`,
        opt
      ).res,
      `HOORAY &mdash; IT&rsquo;S HERE`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`14 - ${`\u001b[${33}m${`opts.convertApostrophes`}\u001b[${39}m`} - mixed #1 - convertApostrophes=on, left single q.`, () => {
  mixer({
    convertEntities: true,
    convertApostrophes: true,
    convertDashes: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `HOORAY  ${rawMDash}  IT${leftSingleQuote}S HERE ${hairspace}`,
        opt
      ).res,
      `HOORAY &mdash; IT&rsquo;S HERE`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`15 - ${`\u001b[${33}m${`opts.convertApostrophes`}\u001b[${39}m`} - mixed #1 - convertApostrophes=off`, () => {
  mixer({
    convertEntities: true,
    convertApostrophes: false,
    convertDashes: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `HOORAY  ${rawMDash}  IT'S HERE ${hairspace}`, opt).res,
      `HOORAY &mdash; IT'S HERE`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`16 - ${`\u001b[${33}m${`opts.convertApostrophes`}\u001b[${39}m`} - mixed #2 - convertApostrophes=on - right single q.`, () => {
  mixer({
    convertEntities: true,
    convertApostrophes: true,
    convertDashes: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `HOORAY  -  IT${rightSingleQuote}S HERE ${hairspace}`,
        opt
      ).res,
      "HOORAY &mdash; IT&rsquo;S HERE",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`17 - ${`\u001b[${33}m${`opts.convertApostrophes`}\u001b[${39}m`} - mixed #2 - convertApostrophes=on - left single q.`, () => {
  mixer({
    convertEntities: true,
    convertApostrophes: true,
    convertDashes: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `HOORAY  -  IT${leftSingleQuote}S HERE ${hairspace}`, opt)
        .res,
      "HOORAY &mdash; IT&rsquo;S HERE",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`18 - ${`\u001b[${33}m${`opts.convertApostrophes`}\u001b[${39}m`} - mixed #2 - convertApostrophes=off - left single q.`, () => {
  mixer({
    convertEntities: true,
    convertApostrophes: false,
    convertDashes: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `HOORAY  -  IT${leftSingleQuote}S HERE ${hairspace}`, opt)
        .res,
      "HOORAY &mdash; IT'S HERE",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`19 - ${`\u001b[${33}m${`opts.convertApostrophes`}\u001b[${39}m`} - mixed #2 - convertApostrophes=off - right single q.`, () => {
  mixer({
    convertEntities: true,
    convertApostrophes: false,
    convertDashes: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `HOORAY  -  IT${rightSingleQuote}S HERE ${hairspace}`,
        opt
      ).res,
      "HOORAY &mdash; IT'S HERE",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`20 - ${`\u001b[${33}m${`opts.convertApostrophes`}\u001b[${39}m`} - mixed #3 - convertApostrophes=on - left single q.`, () => {
  mixer({
    convertEntities: true,
    convertApostrophes: true,
    convertDashes: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `HOORAY  -  IT${leftSingleQuote}S HERE ${hairspace}`, opt)
        .res,
      "HOORAY - IT&rsquo;S HERE",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`21 - ${`\u001b[${33}m${`opts.convertApostrophes`}\u001b[${39}m`} - mixed #3 - convertApostrophes=off - left single q.`, () => {
  mixer({
    convertEntities: true,
    convertApostrophes: false,
    convertDashes: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `HOORAY  -  IT${leftSingleQuote}S HERE ${hairspace}`, opt)
        .res,
      "HOORAY - IT'S HERE",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`22 - ${`\u001b[${33}m${`opts.convertApostrophes`}\u001b[${39}m`} - mixed #3 - convertApostrophes=on - right single q.`, () => {
  mixer({
    convertEntities: true,
    convertApostrophes: true,
    convertDashes: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `HOORAY  -  IT${rightSingleQuote}S HERE ${hairspace}`,
        opt
      ).res,
      "HOORAY - IT&rsquo;S HERE",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`23 - ${`\u001b[${33}m${`opts.convertApostrophes`}\u001b[${39}m`} - mixed #3 - convertApostrophes=off - right single q.`, () => {
  mixer({
    convertEntities: true,
    convertApostrophes: false,
    convertDashes: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `HOORAY  -  IT${rightSingleQuote}S HERE ${hairspace}`,
        opt
      ).res,
      "HOORAY - IT'S HERE",
      JSON.stringify(opt, null, 4)
    );
  });
});

test.skip(`24 - ${`\u001b[${33}m${`opts.convertApostrophes`}\u001b[${39}m`} - mixed #4 - convertApostrophes=on`, () => {
  mixer({
    convertEntities: true, // <-----
    convertApostrophes: true,
    convertDashes: false,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `HOORAY  -  IT${leftSingleQuote}S HERE ${hairspace}`, opt)
        .res,
      "HOORAY&nbsp;- IT&rsquo;S&nbsp;HERE",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    convertEntities: false, // <-----
    convertApostrophes: true,
    convertDashes: false,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `HOORAY  -  IT${leftSingleQuote}S HERE ${hairspace}`, opt)
        .res,
      `HOORAY${rawNbsp}- IT${rightSingleQuote}S${rawNbsp}HERE`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test.skip(`25 - ${`\u001b[${33}m${`opts.convertApostrophes`}\u001b[${39}m`} - mixed #4 - convertApostrophes=off`, () => {
  mixer({
    convertEntities: true,
    convertApostrophes: false,
    convertDashes: false, // <-----
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `HOORAY  -  IT${leftSingleQuote}S HERE ${hairspace}`, opt)
        .res,
      "HOORAY&nbsp;- IT'S&nbsp;HERE",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    convertEntities: true,
    convertApostrophes: false,
    convertDashes: true, // <-----
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `HOORAY  -  IT${leftSingleQuote}S HERE ${hairspace}`, opt)
        .res,
      "HOORAY&nbsp;&mdash; IT'S&nbsp;HERE",
      JSON.stringify(opt, null, 4)
    );
  });
});

test.skip(`26 - ${`\u001b[${33}m${`opts.convertApostrophes`}\u001b[${39}m`} - mixed #4 - convertApostrophes=off`, () => {
  mixer({
    convertEntities: true, // <-----
    convertApostrophes: false,
    convertDashes: false,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `HOORAY  -  IT${rightSingleQuote}S HERE ${hairspace}`,
        opt
      ).res,
      "HOORAY&nbsp;- IT'S&nbsp;HERE",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    convertEntities: false, // <-----
    convertApostrophes: false,
    convertDashes: false,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `HOORAY  -  IT${rightSingleQuote}S HERE ${hairspace}`,
        opt
      ).res,
      `HOORAY${rawNbsp}- IT'S${rawNbsp}HERE`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`27 - ${`\u001b[${33}m${`opts.convertApostrophes`}\u001b[${39}m`} - mixed #5 - convertApostrophes=on`, () => {
  mixer({
    convertEntities: true,
    convertApostrophes: true,
    convertDashes: true,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `HOORAY  ${rawMDash}  IT${leftSingleQuote}S HERE ${hairspace}`,
        opt
      ).res,
      "HOORAY&nbsp;&mdash; IT&rsquo;S&nbsp;HERE",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`28 - ${`\u001b[${33}m${`opts.convertApostrophes`}\u001b[${39}m`} - mixed #5 - convertApostrophes=on`, () => {
  mixer({
    convertEntities: true,
    convertApostrophes: true,
    convertDashes: true,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `HOORAY  ${rawMDash}  IT${rightSingleQuote}S HERE ${hairspace}`,
        opt
      ).res,
      "HOORAY&nbsp;&mdash; IT&rsquo;S&nbsp;HERE",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`29 - ${`\u001b[${33}m${`opts.convertApostrophes`}\u001b[${39}m`} - mixed #5 - convertApostrophes=off`, () => {
  mixer({
    convertEntities: true,
    convertApostrophes: false,
    convertDashes: true,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `HOORAY  ${rawMDash}  IT${leftSingleQuote}S HERE ${hairspace}`,
        opt
      ).res,
      "HOORAY&nbsp;&mdash; IT'S&nbsp;HERE",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`30 - ${`\u001b[${33}m${`opts.convertApostrophes`}\u001b[${39}m`} - mixed #5 - convertApostrophes=off`, () => {
  mixer({
    convertEntities: true,
    convertApostrophes: false,
    convertDashes: true,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `HOORAY  ${rawMDash}  IT${rightSingleQuote}S HERE ${hairspace}`,
        opt
      ).res,
      "HOORAY&nbsp;&mdash; IT'S&nbsp;HERE",
      JSON.stringify(opt, null, 4)
    );
  });
});

// 03. m-dash
// -----------------------------------------------------------------------------

test(`31 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaaaaaaaaaa - aaaaaaaaaaaa`, opt).res,
      "aaaaaaaaaaa&nbsp;&mdash; aaaaaaaaaaaa",
      JSON.stringify(opt, null, 4)
    );
  });
});

test.skip(`32 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: false,
    removeWidows: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaaaaaaaaaa - aaaaaaaaaaaa`, opt).res,
      "aaaaaaaaaaa&nbsp;- aaaaaaaaaaaa",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`33 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaaaaaaaaaa - aaaaaaaaaaaa`, opt).res,
      "aaaaaaaaaaa - aaaaaaaaaaaa",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`34 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `aaaaaaaaaaa ${rawMDash} aaaaaaaaaaaa &mdash; aaaaaaaaaaaa`,
        opt
      ).res,
      `aaaaaaaaaaa&nbsp;&mdash; aaaaaaaaaaaa&nbsp;&mdash;&nbsp;aaaaaaaaaaaa`,
      JSON.stringify(opt, null, 4)
    );
  });

  equal(
    det1(`aaaaaaaaaaa ${rawMDash} aaaaaaaaaaaa &mdash; aaaaaaaaaaaa`, {
      convertDashes: true,
      convertEntities: true,
      removeWidows: true,
    }).res,
    `aaaaaaaaaaa&nbsp;&mdash; aaaaaaaaaaaa&nbsp;&mdash;&nbsp;aaaaaaaaaaaa`,
    "34.02"
  );
});

test(`35 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: true,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawMDash}a`, opt).res,
      "a&nbsp;&mdash;a",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`36 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: true,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawMDash}a`, opt).res,
      "a&nbsp;&mdash; a",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`37 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawMDash}a`, opt).res,
      "a &mdash;a",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`38 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawMDash}a`, opt).res,
      "a &mdash; a",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`39 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: true,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawMDash}a`, opt).res,
      `a${rawNbsp}${rawMDash}a`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`40 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: true,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawMDash}a`, opt).res,
      `a${rawNbsp}${rawMDash} a`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`41 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawMDash}a`, opt).res,
      `a ${rawMDash}a`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`42 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawMDash}a`, opt).res,
      `a ${rawMDash} a`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`43 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: true,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}${rawMDash}a`, opt).res,
      "a&nbsp;&mdash;a",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`44 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: true,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}${rawMDash}a`, opt).res,
      "a&nbsp;&mdash; a",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`45 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}${rawMDash}a`, opt).res,
      "a &mdash;a",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`46 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}${rawMDash}a`, opt).res,
      "a &mdash; a",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`47 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: true,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}${rawMDash}a`, opt).res,
      `a${rawNbsp}${rawMDash}a`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`48 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: true,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}${rawMDash}a`, opt).res,
      `a${rawNbsp}${rawMDash} a`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`49 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}${rawMDash}a`, opt).res,
      `a ${rawMDash}a`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`50 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}${rawMDash} a`, opt).res,
      `a - a`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`51 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`} - false positives`, () => {
  mixer({
    convertEntities: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `Discount: -£10.00`, opt).res,
      "Discount: -&pound;10.00",
      JSON.stringify(opt, null, 4)
    );
  });

  equal(
    det1(`Discount: -£10.00`, {
      convertEntities: true,
      removeWidows: false,
    }).res,
    "Discount: -&pound;10.00",
    "51.02"
  );
});

test(`52 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`} - false positives`, () => {
  mixer({
    convertEntities: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `Discount: -£10.00`, opt).res,
      "Discount: -£10.00",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`53 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`} - false positives`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, `-10.00`, opt).res,
      "-10.00",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`54 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`} - letters, convertEntities=on, removeWidows=on`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `a${hairspace}a a a a a a a a a ${rawMDash} a a a a `,
        opt
      ).res,
      "a a a a a a a a a a&nbsp;&mdash; a a a&nbsp;a",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`55 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`} - letters, convertEntities=on, removeWidows=off`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `a a a a a a${hairspace}a a a a ${rawMDash} a a a a `,
        opt
      ).res,
      "a a a a a a a a a a &mdash; a a a a",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`56 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`} - letters, convertEntities=off, removeWidows=on`, () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `a a a a a a a a a a ${rawMDash} a a a a ${hairspace}`,
        opt
      ).res,
      `a a a a a a a a a a${rawNbsp}${rawMDash} a a a${rawNbsp}a`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`57 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`} - letters, convertEntities=off, removeWidows=off`, () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `a a a a a a a a a a ${rawMDash} a a a a ${hairspace}`,
        opt
      ).res,
      `a a a a a a a a a a ${rawMDash} a a a a`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`58 - ${`\u001b[${32}m${`m-dash`}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}${rawMDash}a`, opt).res,
      `a ${rawMDash} a`,
      JSON.stringify(opt, null, 4)
    );
  });
});

// 04. astral chars
// -----------------------------------------------------------------------------

test(`59 - ${`\u001b[${36}m${`astral chars`}\u001b[${39}m`} - trigram char converted into entity, convertEntities=on`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `\uD834\uDF06`, opt).res,
      "&#x1D306;",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`60 - ${`\u001b[${36}m${`astral chars`}\u001b[${39}m`} - trigram char converted into entity, convertEntities=off`, () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `\uD834\uDF06`, opt).res,
      "\uD834\uDF06",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`61 - ${`\u001b[${36}m${`astral chars`}\u001b[${39}m`} - paired surrogate encoding, convertEntities=on`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `\uD83D\uDE0A`, opt).res,
      "&#x1F60A;",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`62 - ${`\u001b[${36}m${`astral chars`}\u001b[${39}m`} - paired surrogate encoding, convertEntities=off`, () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `\uD83D\uDE0A`, opt).res,
      "\uD83D\uDE0A",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`63 - ${`\u001b[${36}m${`astral chars`}\u001b[${39}m`} - stray low surrogates removed`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, `${rawReplacementMark}a\uD800a\uD83Da\uDBFF`, opt).res,
      "aaa",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`64 - ${`\u001b[${36}m${`astral chars`}\u001b[${39}m`} - stray low surrogates removed`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, `\uDC00a\uDE0Aa\uDFFF`, opt).res,
      "aa",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`65 - ${`\u001b[${36}m${`astral chars`}\u001b[${39}m`} - stray low surrogates removed`, () => {
  mixer().forEach((opt, n) => {
    equal(det(ok, not, n, `\uD835`, opt).res, "", JSON.stringify(opt, null, 4));
  });
});

test(`66 - ${`\u001b[${36}m${`astral chars`}\u001b[${39}m`} - stray low surrogates removed`, () => {
  mixer().forEach((opt, n) => {
    equal(det(ok, not, n, `\uDFD8`, opt).res, "", JSON.stringify(opt, null, 4));
  });
});

test(`67 - ${`\u001b[${36}m${`astral chars`}\u001b[${39}m`} - stray low surrogates removed`, () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `gr\u00F6\u00DFer`, opt).res,
      "gr\u00F6\u00DFer",
      JSON.stringify(opt, null, 4)
    );
  });
});

// 05. opts.convertApostrophes
// -----------------------------------------------------------------------------

test(`68 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - German characters`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `gr\u00F6\u00DFer`, opt).res,
      "gr&ouml;&szlig;er",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`69 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - single raw apostrophes are not encoded`, () => {
  mixer({
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, `'`, opt).res, "'", JSON.stringify(opt, null, 4));
  });
});

test(`70 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - single encoded apostrophes are decoded`, () => {
  mixer({
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `&apos;`, opt).res,
      "'",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `&#x27;`, opt).res,
      "'",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`71 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - single apostrophes`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `It&apos;s Monday.`, opt).res,
      `It${rightSingleQuote}s Monday.`,
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `It&#x27;s Monday.`, opt).res,
      `It${rightSingleQuote}s Monday.`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`72 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - single apostrophes`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `It&apos;s Monday.`, opt).res,
      "It&rsquo;s Monday.",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `It&#x27;s Monday.`, opt).res,
      "It&rsquo;s Monday.",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`73 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - single apostrophes`, () => {
  mixer({
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `It&apos;s Monday.`, opt).res,
      "It's Monday.",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `It&#x27;s Monday.`, opt).res,
      "It's Monday.",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`74 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks - case of "wouldn't"`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `wouldn${rawReplacementMark}t`, opt).res,
      "wouldn&rsquo;t",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`75 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks - case of "wouldn't"`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `wouldn${rawReplacementMark}t`, opt).res,
      `wouldn${rightSingleQuote}t`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`76 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks - case of "wouldn't"`, () => {
  mixer({
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `wouldn${rawReplacementMark}t`, opt).res,
      `wouldn't`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`77 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks - case of "wouldn't" - caps`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `WOULDN${rawReplacementMark}T`, opt).res,
      "WOULDN&rsquo;T",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`78 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks - case of "wouldn't" - caps`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `WOULDN${rawReplacementMark}T`, opt).res,
      `WOULDN${rightSingleQuote}T`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`79 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks - case of "wouldn't" - caps`, () => {
  mixer({
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `WOULDN${rawReplacementMark}T`, opt).res,
      `WOULDN'T`,
      JSON.stringify(opt, null, 4)
    );
  });
});

// rawReplacementMark === �
test(`80 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks - case of "one's"`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `one${rawReplacementMark}s`, opt).res,
      "one&rsquo;s",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`81 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks - case of "one's"`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `one${rawReplacementMark}s`, opt).res,
      `one${rightSingleQuote}s`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`82 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - converts to non-fancy which is never encoded`, () => {
  mixer({
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `one${rawReplacementMark}s`, opt).res,
      `one's`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`83 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - converts to fancy, encoded`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `ONE${rawReplacementMark}S`, opt).res,
      "ONE&rsquo;S",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`84 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - converts to fancy but leaves unencoded`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `ONE${rawReplacementMark}S`, opt).res,
      `ONE${rightSingleQuote}S`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`85 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - converts to non-fancy which is never encoded`, () => {
  mixer({
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `ONE${rawReplacementMark}S`, opt).res,
      `ONE'S`,
      JSON.stringify(opt, null, 4)
    );
  });
});

// 06 - converts replacement marks back into normal text
// -----------------------------------------------------------------------------
// ${rawReplacementMark} = �

test(`86 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `couldn${rawReplacementMark}t`, opt).res,
      "couldn&rsquo;t",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`87 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `we${rawReplacementMark}re`, opt).res,
      "we&rsquo;re",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`88 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `you${rawReplacementMark}re`, opt).res,
      "you&rsquo;re",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`89 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `they${rawReplacementMark}re`, opt).res,
      "they&rsquo;re",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`90 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `YOU${rawReplacementMark}RE`, opt).res,
      "YOU&rsquo;RE",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`91 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `I${rawReplacementMark}ll`, opt).res,
      "I&rsquo;ll",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`92 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `you${rawReplacementMark}ll`, opt).res,
      "you&rsquo;ll",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`93 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `he${rawReplacementMark}ll`, opt).res,
      "he&rsquo;ll",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`94 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `she${rawReplacementMark}ll`, opt).res,
      "she&rsquo;ll",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`95 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `we${rawReplacementMark}ll`, opt).res,
      "we&rsquo;ll",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`96 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `they${rawReplacementMark}ll`, opt).res,
      "they&rsquo;ll",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`97 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `YOU${rawReplacementMark}LL`, opt).res,
      "YOU&rsquo;LL",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`98 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `HE${rawReplacementMark}LL`, opt).res,
      "HE&rsquo;LL",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`99 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `SHE${rawReplacementMark}LL`, opt).res,
      "SHE&rsquo;LL",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`100 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `WE${rawReplacementMark}LL`, opt).res,
      "WE&rsquo;LL",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`101 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `THEY${rawReplacementMark}LL`, opt).res,
      "THEY&rsquo;LL",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`102 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `might${rawReplacementMark}ve`, opt).res,
      "might&rsquo;ve",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`103 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `she${rawReplacementMark}s`, opt).res,
      "she&rsquo;s",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`104 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `they${rawReplacementMark}re`, opt).res,
      "they&rsquo;re",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`105 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `they${rawReplacementMark}ve`, opt).res,
      "they&rsquo;ve",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`106 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `they${rawReplacementMark}ll`, opt).res,
      "they&rsquo;ll",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`107 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `peoples${rawReplacementMark}`, opt).res,
      "peoples&rsquo;",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`108 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `Mr. Brown${rawReplacementMark}s`, opt).res,
      "Mr. Brown&rsquo;s",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`109 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertEntities: true,
    removeWidows: false,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `minutes ${rawReplacementMark} we`, opt).res,
      "minutes &mdash; we",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`110 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertEntities: true,
    removeWidows: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `minutes ${rawReplacementMark} we`, opt).res,
      "minutes&nbsp;&mdash; we",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`111 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertEntities: false,
    removeWidows: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `minutes ${rawReplacementMark} we`, opt).res,
      `minutes${rawNbsp}${rawMDash} we`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`112 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertEntities: false,
    removeWidows: false,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `minutes ${rawReplacementMark} we`, opt).res,
      `minutes ${rawMDash} we`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`113 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertEntities: true,
    removeWidows: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `minutes ${rawReplacementMark} we`, opt).res,
      "minutes - we",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`114 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertEntities: true,
    removeWidows: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `minutes ${rawReplacementMark} we`, opt).res,
      "minutes&nbsp;- we",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`115 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertEntities: false,
    removeWidows: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `minutes ${rawReplacementMark} we`, opt).res,
      `minutes${rawNbsp}- we`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`116 - ${`\u001b[${34}m${`opts.convertApostrophes`}\u001b[${39}m`} - replacement marks`, () => {
  mixer({
    convertEntities: false,
    removeWidows: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `minutes ${rawReplacementMark} we`, opt).res,
      `minutes - we`,
      JSON.stringify(opt, null, 4)
    );
  });
});

// 07. numeric entities
// -----------------------------------------------------------------------------

test(`117 - ${`\u001b[${35}m${`numeric entities`}\u001b[${39}m`} - numeric entities`, () => {
  equal(
    det(ok, not, 0, `aaaaaaa aaaaaaaaa aaaaaaaaaa&#160;bbbb`).res,
    "aaaaaaa aaaaaaaaa aaaaaaaaaa&nbsp;bbbb",
    "117.01"
  );
});

test(`118 - ${`\u001b[${35}m${`numeric entities`}\u001b[${39}m`} - named entities`, () => {
  equal(
    det(ok, not, 0, `aaaaaaa aaaaaaaaa aaaaaaaaaa&nbsp;bbbb`).res,
    "aaaaaaa aaaaaaaaa aaaaaaaaaa&nbsp;bbbb",
    "118.01"
  );
});

test(`119 - ${`\u001b[${35}m${`numeric entities`}\u001b[${39}m`} - raw characters`, () => {
  equal(
    det(ok, not, 0, `aaaaaaa aaaaaaaaa aaaaaaaaa${rawNbsp}bbbb`).res,
    "aaaaaaa aaaaaaaaa aaaaaaaaa&nbsp;bbbb",
    "119.01"
  );
});

// 08. erroneous entities
// -----------------------------------------------------------------------------

test(`120 - ${`\u001b[${35}m${`erroneous entities`}\u001b[${39}m`} - potentially clashing incomplete named entities - precaution &fnof; (\\u0192)`, () => {
  equal(det(ok, not, 0, `aaa&fnof;aaa`).res, "aaa&fnof;aaa", "120.01");
});

test(`121 - ${`\u001b[${35}m${`erroneous entities`}\u001b[${39}m`} - potentially clashing incomplete named entities`, () => {
  equal(det(ok, not, 0, `aaa&thinsp;aaa`).res, "aaa aaa", "121.01");
});

test(`122 - ${`\u001b[${35}m${`erroneous entities`}\u001b[${39}m`} - potentially clashing incomplete named entities`, () => {
  equal(det(ok, not, 0, `aaa&zwnjaaa`).res, "aaa&zwnj;aaa", "122.01");
});

test(`123 - ${`\u001b[${35}m${`erroneous entities`}\u001b[${39}m`} - potentially clashing incomplete named entities`, () => {
  equal(
    det(ok, not, 0, `aaa&pi&piv&pi&pivaaa`, {
      convertEntities: false,
    }).res,
    "aaa\u03C0\u03D6\u03C0\u03D6aaa",
    "123.01"
  );
});

test(`124 - ${`\u001b[${35}m${`erroneous entities`}\u001b[${39}m`} - potentially clashing incomplete named entities`, () => {
  equal(
    det(ok, not, 0, `aaa&pi&piv&pi&pivaaa`, {
      convertEntities: true,
      dontEncodeNonLatin: false,
    }).res,
    "aaa&pi;&piv;&pi;&piv;aaa",
    "124.01"
  );
});

test(`125 - ${`\u001b[${35}m${`erroneous entities`}\u001b[${39}m`} - precaution against false positives`, () => {
  mixer({
    convertEntities: false,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Zzz times; Zzzz or; Zzzzzz real; Zzzz alpha; Zzzzz exist; Zzzzz euro;",
        opt
      ).res,
      `Zzz times; Zzzz or; Zzzzzz real; Zzzz alpha; Zzzzz exist; Zzzzz${rawNbsp}euro;`,
      "125.01"
    );
  });
});

test(`126 - ${`\u001b[${35}m${`erroneous entities`}\u001b[${39}m`} - potentially clashing incomplete named entities`, () => {
  equal(
    det(ok, not, 0, `aaa&sup&sup1&sup&sup2&sup&sup3&sup&supeaaa`).res,
    "aaa&sup;&sup1;&sup;&sup2;&sup;&sup3;&sup;&supe;aaa",
    "126.01"
  );
});

test(`127 - ${`\u001b[${35}m${`erroneous entities`}\u001b[${39}m`} - potentially clashing incomplete named entities`, () => {
  equal(
    det(ok, not, 0, `aaa&theta&thetasym&theta&thetasymaaa`, {
      convertEntities: false,
    }).res,
    he.decode("aaa&theta;&thetasym;&theta;&thetasym;aaa"),
    "127.01"
  );
});

test(`128 - ${`\u001b[${35}m${`erroneous entities`}\u001b[${39}m`} - potentially clashing incomplete named entities`, () => {
  equal(
    det(ok, not, 0, `aaa&ang&angst&ang&angstaaa`).res,
    "aaa&ang;&#xC5;&ang;&#xC5;aaa",
    "128.01"
  );
});

// 09. sanity checks
// -----------------------------------------------------------------------------

test(`129 - ${`\u001b[${90}m${`sanity checks`}\u001b[${39}m`} - checking if entity references are left intact`, () => {
  equal(det(ok, not, 0, `aaa&lt;bbb ccc`).res, "aaa&lt;bbb ccc", "129.01");
});

test(`130 - ${`\u001b[${90}m${`sanity checks`}\u001b[${39}m`} - checking if entity references are left intact`, () => {
  equal(
    det(ok, not, 0, `aaa&lt;bbb ccc`, {
      convertEntities: true,
    }).res,
    "aaa&lt;bbb ccc",
    "130.01"
  );
});

test(`131 - ${`\u001b[${90}m${`sanity checks`}\u001b[${39}m`} - checking if entity references are left intact`, () => {
  equal(
    det(ok, not, 0, `aaa&lt;bbb ccc`, {
      convertEntities: false,
    }).res,
    "aaa<bbb ccc",
    "131.01"
  );
});

test(`132 - ${`\u001b[${90}m${`sanity checks`}\u001b[${39}m`} - checking if entity references are left intact`, () => {
  equal(det(ok, not, 0, `aaa<bbb ccc`).res, "aaa&lt;bbb ccc", "132.01");
});

test(`133 - ${`\u001b[${90}m${`sanity checks`}\u001b[${39}m`} - checking if entity references are left intact`, () => {
  equal(
    det(ok, not, 0, `aaa<bbb ccc`, { convertEntities: true }).res,
    "aaa&lt;bbb ccc",
    "133.01"
  );
});

test(`134 - ${`\u001b[${90}m${`sanity checks`}\u001b[${39}m`} - checking if entity references are left intact`, () => {
  equal(
    det(ok, not, 0, `aaa<bbb ccc`, { convertEntities: false }).res,
    "aaa<bbb ccc",
    "134.01"
  );
});

test(`135 - ${`\u001b[${90}m${`sanity checks`}\u001b[${39}m`} - precaution against false positives`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Zzz times; Zzzz or; Zzzzzz real; Zzzz alpha; Zzzzz exist; Zzzzz euro;",
        opt
      ).res,
      "Zzz times; Zzzz or; Zzzzzz real; Zzzz alpha; Zzzzz exist; Zzzzz euro;",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`136 - ${`\u001b[${90}m${`sanity checks`}\u001b[${39}m`} - precaution against false positives`, () => {
  mixer({
    convertEntities: true,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Zzz times; Zzzz or; Zzzzzz real; Zzzz alpha; Zzzzz exist; Zzzzz euro;",
        opt
      ).res,
      "Zzz times; Zzzz or; Zzzzzz real; Zzzz alpha; Zzzzz exist; Zzzzz&nbsp;euro;",
      JSON.stringify(opt, null, 4)
    );
  });
});

// ============================================================================
// 10. some HTML entitities can't be sent in named entities format, only in numeric
// ============================================================================

test(`137 - email-not-friendly entities`, () => {
  equal(
    det(ok, not, 0, `&Breve;`, { convertEntities: true }).res,
    "&#x2D8;",
    "137.01"
  );
});

test(`138 - email-not-friendly entities`, () => {
  equal(
    det(ok, not, 0, `&Breve;`, { convertEntities: false }).res,
    "\u02D8",
    "138.01"
  );
});

test(`139 - numeric entities`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "&Breve;&Backslash;&Cacute;&CircleDot;&DD;&Diamond;&DownArrow;&LT;&RightArrow;&SmallCircle;&Uarr;&Verbar;&angst;&zdot; a",
        opt
      ).res,
      "&#x2D8;&#x2216;&#x106;&#x2299;&#x2145;&#x22C4;&darr;&lt;&rarr;&#x2218;&#x219F;&#x2016;&#xC5;&#x17C; a",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`140 - wrong named entity QUOT into quot`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `&QUOT;`, opt).res,
      "&quot;",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`141 - enforce spaces after semicolons - semicol between letters, addMissingSpaces=on`, () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaa;aaa`, opt).res,
      "aaa; aaa",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`142 - enforce spaces after semicolons - semicol between letters, addMissingSpaces=off`, () => {
  mixer({
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaa;aaa`, opt).res,
      "aaa;aaa",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`143 - enforce spaces after semicolons - semicol between letters, ends with semicol`, () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaa;aaa;`, opt).res,
      "aaa; aaa;",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`144 - enforce spaces after semicolons - semicol between letters, ends with semicol`, () => {
  mixer({
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaa;aaa;`, opt).res,
      "aaa;aaa;",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`145 - enforce spaces after semicolons - semicol fixes must not affect HTML entities`, () => {
  mixer({
    convertEntities: true,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaa&nbsp;aaa`, opt).res,
      "aaa&nbsp;aaa",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`146 - enforce spaces after dot if upper-case letter follows`, () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaa.Aaa`, opt).res,
      "aaa. Aaa",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`147 - does not touch dots among lowercase letters`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaa.aaa`, opt).res,
      "aaa.aaa",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`148 - letters within ASCII are decoded if come encoded`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, `&#x61;`, opt).res,
      "a",
      JSON.stringify(opt, null, 4)
    );
  });
});

test.run();
