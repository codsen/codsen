// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import {
  hairspace,
  // rightDoubleQuote,
  // leftDoubleQuote,
  leftSingleQuote,
  // rawNDash,
  rawMDash,
  rawNbsp,
  rawReplacementMark,
  // ellipsis,
  rightSingleQuote,
} from "codsen-utils";
import he from "he";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

// 01. opts.convertEntities
// -----------------------------------------------------------------------------

test("001 - opts.convertEntities - pound - convertEntities=on", () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\u00A3", opt).res,
      "&pound;",
      `001.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("002 - opts.convertEntities - pound - convertEntities=off", () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\u00A3", opt).res,
      "\u00A3",
      `002.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("003 - opts.convertEntities - m-dash", () => {
  mixer({
    convertEntities: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `${rawMDash}`, opt).res,
      "&mdash;",
      `003.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("004 - opts.convertEntities - m-dash", () => {
  mixer({
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `${rawMDash}`, opt).res,
      "-",
      `004.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("005 - opts.convertEntities - m-dash", () => {
  mixer({
    convertEntities: false,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `${rawMDash}`, opt).res,
      `${rawMDash}`,
      `005.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("006 - opts.convertEntities - m-dash", () => {
  mixer({
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `${rawMDash}`, opt).res,
      "-",
      `006.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("007 - opts.convertEntities - hairspace", () => {
  mixer({
    convertEntities: false,
    removeWidows: false,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}&mdash;${hairspace}a`, opt).res,
      `a ${rawMDash} a`,
      `007.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("008 - opts.convertEntities - hairspace", () => {
  mixer({
    convertDashes: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}&mdash;${hairspace}a`, opt).res,
      "a - a",
      `008.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("009 - opts.convertEntities - ad hoc 1", () => {
  equal(
    det1('"', { convertApostrophes: false, convertEntities: true }).res,
    "&quot;",
    "009.01",
  );
});

test("010 - opts.convertEntities - ad hoc 1", () => {
  equal(
    det1('^"', { convertApostrophes: false, convertEntities: true }).res,
    "^&quot;",
    "010.01",
  );
});

test("011 - opts.convertEntities - ad hoc 1", () => {
  equal(
    det1('^`"', { convertApostrophes: false, convertEntities: true }).res,
    "^`&quot;",
    "011.01",
  );
});

test("012 - opts.convertEntities - ad hoc 1", () => {
  mixer({
    convertEntities: true,
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, '^`"', opt).res,
      "^`&quot;",
      `012.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
  mixer({
    convertEntities: true,
    convertApostrophes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, '^`"', opt).res,
      "^`&rdquo;",
      `012.02 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

// 02. mixed cases
// -----------------------------------------------------------------------------

test("013 - opts.convertApostrophes - mixed #1 - convertApostrophes=on, right single q.", () => {
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
        opt,
      ).res,
      "HOORAY &mdash; IT&rsquo;S HERE",
      `013.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("014 - opts.convertApostrophes - mixed #1 - convertApostrophes=on, left single q.", () => {
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
        opt,
      ).res,
      "HOORAY &mdash; IT&rsquo;S HERE",
      `014.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("015 - opts.convertApostrophes - mixed #1 - convertApostrophes=off", () => {
  mixer({
    convertEntities: true,
    convertApostrophes: false,
    convertDashes: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `HOORAY  ${rawMDash}  IT'S HERE ${hairspace}`, opt).res,
      "HOORAY &mdash; IT'S HERE",
      `015.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("016 - opts.convertApostrophes - mixed #2 - convertApostrophes=on - right single q.", () => {
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
        opt,
      ).res,
      "HOORAY &mdash; IT&rsquo;S HERE",
      `016.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("017 - opts.convertApostrophes - mixed #2 - convertApostrophes=on - left single q.", () => {
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
      `017.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("018 - opts.convertApostrophes - mixed #2 - convertApostrophes=off - left single q.", () => {
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
      `018.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("019 - opts.convertApostrophes - mixed #2 - convertApostrophes=off - right single q.", () => {
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
        opt,
      ).res,
      "HOORAY &mdash; IT'S HERE",
      `019.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("020 - opts.convertApostrophes - mixed #3 - convertApostrophes=on - left single q.", () => {
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
      `020.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("021 - opts.convertApostrophes - mixed #3 - convertApostrophes=off - left single q.", () => {
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
      `021.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("022 - opts.convertApostrophes - mixed #3 - convertApostrophes=on - right single q.", () => {
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
        opt,
      ).res,
      "HOORAY - IT&rsquo;S HERE",
      `022.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("023 - opts.convertApostrophes - mixed #3 - convertApostrophes=off - right single q.", () => {
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
        opt,
      ).res,
      "HOORAY - IT'S HERE",
      `023.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test.skip(`024 - ${`\u001b[${33}m${"opts.convertApostrophes"}\u001b[${39}m`} - mixed #4 - convertApostrophes=on`, () => {
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
      `024.01 - ${JSON.stringify(opt, null, 4)}`,
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
      `024.02 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test.skip(`025 - ${`\u001b[${33}m${"opts.convertApostrophes"}\u001b[${39}m`} - mixed #4 - convertApostrophes=off`, () => {
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
      `025.01 - ${JSON.stringify(opt, null, 4)}`,
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
      `025.02 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test.skip(`026 - ${`\u001b[${33}m${"opts.convertApostrophes"}\u001b[${39}m`} - mixed #4 - convertApostrophes=off`, () => {
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
        opt,
      ).res,
      "HOORAY&nbsp;- IT'S&nbsp;HERE",
      `026.01 - ${JSON.stringify(opt, null, 4)}`,
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
        opt,
      ).res,
      `HOORAY${rawNbsp}- IT'S${rawNbsp}HERE`,
      `026.02 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("027 - opts.convertApostrophes - mixed #5 - convertApostrophes=on", () => {
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
        opt,
      ).res,
      "HOORAY&nbsp;&mdash; IT&rsquo;S&nbsp;HERE",
      `027.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("028 - opts.convertApostrophes - mixed #5 - convertApostrophes=on", () => {
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
        opt,
      ).res,
      "HOORAY&nbsp;&mdash; IT&rsquo;S&nbsp;HERE",
      `028.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("029 - opts.convertApostrophes - mixed #5 - convertApostrophes=off", () => {
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
        opt,
      ).res,
      "HOORAY&nbsp;&mdash; IT'S&nbsp;HERE",
      `029.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("030 - opts.convertApostrophes - mixed #5 - convertApostrophes=off", () => {
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
        opt,
      ).res,
      "HOORAY&nbsp;&mdash; IT'S&nbsp;HERE",
      `030.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

// 03. m-dash
// -----------------------------------------------------------------------------

test("031 - m-dash", () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaaaaaaaaaa - aaaaaaaaaaaa", opt).res,
      "aaaaaaaaaaa&nbsp;&mdash; aaaaaaaaaaaa",
      `031.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test.skip(`032 - ${`\u001b[${32}m${"m-dash"}\u001b[${39}m`}`, () => {
  mixer({
    convertDashes: false,
    removeWidows: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaaaaaaaaaa - aaaaaaaaaaaa", opt).res,
      "aaaaaaaaaaa&nbsp;- aaaaaaaaaaaa",
      `032.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("033 - m-dash", () => {
  mixer({
    convertDashes: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaaaaaaaaaa - aaaaaaaaaaaa", opt).res,
      "aaaaaaaaaaa - aaaaaaaaaaaa",
      `033.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("034 - m-dash", () => {
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
        opt,
      ).res,
      "aaaaaaaaaaa&nbsp;&mdash; aaaaaaaaaaaa&nbsp;&mdash;&nbsp;aaaaaaaaaaaa",
      `034.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });

  equal(
    det1(`aaaaaaaaaaa ${rawMDash} aaaaaaaaaaaa &mdash; aaaaaaaaaaaa`, {
      convertDashes: true,
      convertEntities: true,
      removeWidows: true,
    }).res,
    "aaaaaaaaaaa&nbsp;&mdash; aaaaaaaaaaaa&nbsp;&mdash;&nbsp;aaaaaaaaaaaa",
    "034.02",
  );
});

test("035 - m-dash", () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: true,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawMDash}a`, opt).res,
      "a&nbsp;&mdash;a",
      `035.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("036 - m-dash", () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: true,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawMDash}a`, opt).res,
      "a&nbsp;&mdash; a",
      `036.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("037 - m-dash", () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawMDash}a`, opt).res,
      "a &mdash;a",
      `037.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("038 - m-dash", () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawMDash}a`, opt).res,
      "a &mdash; a",
      `038.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("039 - m-dash", () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: true,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawMDash}a`, opt).res,
      `a${rawNbsp}${rawMDash}a`,
      `039.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("040 - m-dash", () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: true,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawMDash}a`, opt).res,
      `a${rawNbsp}${rawMDash} a`,
      `040.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("041 - m-dash", () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawMDash}a`, opt).res,
      `a ${rawMDash}a`,
      `041.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("042 - m-dash", () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a ${rawMDash}a`, opt).res,
      `a ${rawMDash} a`,
      `042.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("043 - m-dash", () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: true,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}${rawMDash}a`, opt).res,
      "a&nbsp;&mdash;a",
      `043.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("044 - m-dash", () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: true,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}${rawMDash}a`, opt).res,
      "a&nbsp;&mdash; a",
      `044.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("045 - m-dash", () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}${rawMDash}a`, opt).res,
      "a &mdash;a",
      `045.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("046 - m-dash", () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
    removeWidows: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}${rawMDash}a`, opt).res,
      "a &mdash; a",
      `046.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("047 - m-dash", () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: true,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}${rawMDash}a`, opt).res,
      `a${rawNbsp}${rawMDash}a`,
      `047.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("048 - m-dash", () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: true,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}${rawMDash}a`, opt).res,
      `a${rawNbsp}${rawMDash} a`,
      `048.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("049 - m-dash", () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}${rawMDash}a`, opt).res,
      `a ${rawMDash}a`,
      `049.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("050 - m-dash", () => {
  mixer({
    convertDashes: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}${rawMDash} a`, opt).res,
      "a - a",
      `050.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("051 - m-dash - false positives", () => {
  mixer({
    convertEntities: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Discount: -£10.00", opt).res,
      "Discount: -&pound;10.00",
      `051.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });

  equal(
    det1("Discount: -£10.00", {
      convertEntities: true,
      removeWidows: false,
    }).res,
    "Discount: -&pound;10.00",
    "051.02",
  );
});

test("052 - m-dash - false positives", () => {
  mixer({
    convertEntities: false,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Discount: -£10.00", opt).res,
      "Discount: -£10.00",
      `052.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("053 - m-dash - false positives", () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "-10.00", opt).res,
      "-10.00",
      `053.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("054 - m-dash - letters, convertEntities=on, removeWidows=on", () => {
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
        opt,
      ).res,
      "a a a a a a a a a a&nbsp;&mdash; a a a&nbsp;a",
      `054.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("055 - m-dash - letters, convertEntities=on, removeWidows=off", () => {
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
        opt,
      ).res,
      "a a a a a a a a a a &mdash; a a a a",
      `055.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("056 - m-dash - letters, convertEntities=off, removeWidows=on", () => {
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
        opt,
      ).res,
      `a a a a a a a a a a${rawNbsp}${rawMDash} a a a${rawNbsp}a`,
      `056.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("057 - m-dash - letters, convertEntities=off, removeWidows=off", () => {
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
        opt,
      ).res,
      `a a a a a a a a a a ${rawMDash} a a a a`,
      `057.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("058 - m-dash", () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
    removeWidows: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a${hairspace}${rawMDash}a`, opt).res,
      `a ${rawMDash} a`,
      `058.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

// 04. astral chars
// -----------------------------------------------------------------------------

test("059 - astral chars - trigram char converted into entity, convertEntities=on", () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\uD834\uDF06", opt).res,
      "&#x1D306;",
      `059.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("060 - astral chars - trigram char converted into entity, convertEntities=off", () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\uD834\uDF06", opt).res,
      "\uD834\uDF06",
      `060.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("061 - astral chars - paired surrogate encoding, convertEntities=on", () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\uD83D\uDE0A", opt).res,
      "&#x1F60A;",
      `061.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("062 - astral chars - paired surrogate encoding, convertEntities=off", () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\uD83D\uDE0A", opt).res,
      "\uD83D\uDE0A",
      `062.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("063 - astral chars - stray low surrogates removed", () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, `${rawReplacementMark}a\uD800a\uD83Da\uDBFF`, opt).res,
      "aaa",
      `063.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("064 - astral chars - stray low surrogates removed", () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "\uDC00a\uDE0Aa\uDFFF", opt).res,
      "aa",
      `064.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("065 - astral chars - stray low surrogates removed", () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "\uD835", opt).res,
      "",
      `065.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("066 - astral chars - stray low surrogates removed", () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "\uDFD8", opt).res,
      "",
      `066.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("067 - astral chars - stray low surrogates removed", () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "gr\u00F6\u00DFer", opt).res,
      "gr\u00F6\u00DFer",
      `067.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

// 05. opts.convertApostrophes
// -----------------------------------------------------------------------------

test("068 - opts.convertApostrophes - German characters", () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "gr\u00F6\u00DFer", opt).res,
      "gr&ouml;&szlig;er",
      `068.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("069 - opts.convertApostrophes - single raw apostrophes are not encoded", () => {
  mixer({
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'", opt).res,
      "'",
      `069.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("070 - opts.convertApostrophes - single encoded apostrophes are decoded", () => {
  mixer({
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&apos;", opt).res,
      "'",
      `070.01 - ${JSON.stringify(opt, null, 4)}`,
    );
    equal(
      det(ok, not, n, "&#x27;", opt).res,
      "'",
      `070.02 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("071 - opts.convertApostrophes - single apostrophes", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "It&apos;s Monday.", opt).res,
      `It${rightSingleQuote}s Monday.`,
      `071.01 - ${JSON.stringify(opt, null, 4)}`,
    );
    equal(
      det(ok, not, n, "It&#x27;s Monday.", opt).res,
      `It${rightSingleQuote}s Monday.`,
      `071.02 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("072 - opts.convertApostrophes - single apostrophes", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "It&apos;s Monday.", opt).res,
      "It&rsquo;s Monday.",
      `072.01 - ${JSON.stringify(opt, null, 4)}`,
    );
    equal(
      det(ok, not, n, "It&#x27;s Monday.", opt).res,
      "It&rsquo;s Monday.",
      `072.02 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("073 - opts.convertApostrophes - single apostrophes", () => {
  mixer({
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "It&apos;s Monday.", opt).res,
      "It's Monday.",
      `073.01 - ${JSON.stringify(opt, null, 4)}`,
    );
    equal(
      det(ok, not, n, "It&#x27;s Monday.", opt).res,
      "It's Monday.",
      `073.02 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test('074 - opts.convertApostrophes - replacement marks - case of "wouldn\'t"', () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `wouldn${rawReplacementMark}t`, opt).res,
      "wouldn&rsquo;t",
      `074.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test('075 - opts.convertApostrophes - replacement marks - case of "wouldn\'t"', () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `wouldn${rawReplacementMark}t`, opt).res,
      `wouldn${rightSingleQuote}t`,
      `075.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test('076 - opts.convertApostrophes - replacement marks - case of "wouldn\'t"', () => {
  mixer({
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `wouldn${rawReplacementMark}t`, opt).res,
      "wouldn't",
      `076.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test('077 - opts.convertApostrophes - replacement marks - case of "wouldn\'t" - caps', () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `WOULDN${rawReplacementMark}T`, opt).res,
      "WOULDN&rsquo;T",
      `077.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test('078 - opts.convertApostrophes - replacement marks - case of "wouldn\'t" - caps', () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `WOULDN${rawReplacementMark}T`, opt).res,
      `WOULDN${rightSingleQuote}T`,
      `078.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test('079 - opts.convertApostrophes - replacement marks - case of "wouldn\'t" - caps', () => {
  mixer({
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `WOULDN${rawReplacementMark}T`, opt).res,
      "WOULDN'T",
      `079.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

// rawReplacementMark === �
test('080 - opts.convertApostrophes - replacement marks - case of "one\'s"', () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `one${rawReplacementMark}s`, opt).res,
      "one&rsquo;s",
      `080.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test('081 - opts.convertApostrophes - replacement marks - case of "one\'s"', () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `one${rawReplacementMark}s`, opt).res,
      `one${rightSingleQuote}s`,
      `081.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("082 - opts.convertApostrophes - converts to non-fancy which is never encoded", () => {
  mixer({
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `one${rawReplacementMark}s`, opt).res,
      "one's",
      `082.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("083 - opts.convertApostrophes - converts to fancy, encoded", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `ONE${rawReplacementMark}S`, opt).res,
      "ONE&rsquo;S",
      `083.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("084 - opts.convertApostrophes - converts to fancy but leaves unencoded", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `ONE${rawReplacementMark}S`, opt).res,
      `ONE${rightSingleQuote}S`,
      `084.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("085 - opts.convertApostrophes - converts to non-fancy which is never encoded", () => {
  mixer({
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `ONE${rawReplacementMark}S`, opt).res,
      "ONE'S",
      `085.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

// 06 - converts replacement marks back into normal text
// -----------------------------------------------------------------------------
// ${rawReplacementMark} = �

test("086 - opts.convertApostrophes - replacement marks", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `couldn${rawReplacementMark}t`, opt).res,
      "couldn&rsquo;t",
      `086.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("087 - opts.convertApostrophes - replacement marks", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `we${rawReplacementMark}re`, opt).res,
      "we&rsquo;re",
      `087.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("088 - opts.convertApostrophes - replacement marks", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `you${rawReplacementMark}re`, opt).res,
      "you&rsquo;re",
      `088.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("089 - opts.convertApostrophes - replacement marks", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `they${rawReplacementMark}re`, opt).res,
      "they&rsquo;re",
      `089.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("090 - opts.convertApostrophes - replacement marks", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `YOU${rawReplacementMark}RE`, opt).res,
      "YOU&rsquo;RE",
      `090.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("091 - opts.convertApostrophes - replacement marks", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `I${rawReplacementMark}ll`, opt).res,
      "I&rsquo;ll",
      `091.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("092 - opts.convertApostrophes - replacement marks", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `you${rawReplacementMark}ll`, opt).res,
      "you&rsquo;ll",
      `092.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("093 - opts.convertApostrophes - replacement marks", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `he${rawReplacementMark}ll`, opt).res,
      "he&rsquo;ll",
      `093.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("094 - opts.convertApostrophes - replacement marks", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `she${rawReplacementMark}ll`, opt).res,
      "she&rsquo;ll",
      `094.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("095 - opts.convertApostrophes - replacement marks", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `we${rawReplacementMark}ll`, opt).res,
      "we&rsquo;ll",
      `095.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("096 - opts.convertApostrophes - replacement marks", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `they${rawReplacementMark}ll`, opt).res,
      "they&rsquo;ll",
      `096.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("097 - opts.convertApostrophes - replacement marks", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `YOU${rawReplacementMark}LL`, opt).res,
      "YOU&rsquo;LL",
      `097.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("098 - opts.convertApostrophes - replacement marks", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `HE${rawReplacementMark}LL`, opt).res,
      "HE&rsquo;LL",
      `098.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("099 - opts.convertApostrophes - replacement marks", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `SHE${rawReplacementMark}LL`, opt).res,
      "SHE&rsquo;LL",
      `099.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test(`100 - opts.convertApostrophes - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `WE${rawReplacementMark}LL`, opt).res,
      "WE&rsquo;LL",
      `100.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test(`101 - opts.convertApostrophes - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `THEY${rawReplacementMark}LL`, opt).res,
      "THEY&rsquo;LL",
      `101.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test(`102 - opts.convertApostrophes - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `might${rawReplacementMark}ve`, opt).res,
      "might&rsquo;ve",
      `102.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test(`103 - opts.convertApostrophes - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `she${rawReplacementMark}s`, opt).res,
      "she&rsquo;s",
      `103.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test(`104 - opts.convertApostrophes - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `they${rawReplacementMark}re`, opt).res,
      "they&rsquo;re",
      `104.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test(`105 - opts.convertApostrophes - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `they${rawReplacementMark}ve`, opt).res,
      "they&rsquo;ve",
      `105.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test(`106 - opts.convertApostrophes - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `they${rawReplacementMark}ll`, opt).res,
      "they&rsquo;ll",
      `106.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test(`107 - opts.convertApostrophes - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `peoples${rawReplacementMark}`, opt).res,
      "peoples&rsquo;",
      `107.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test(`108 - opts.convertApostrophes - replacement marks`, () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `Mr. Brown${rawReplacementMark}s`, opt).res,
      "Mr. Brown&rsquo;s",
      `108.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test(`109 - opts.convertApostrophes - replacement marks`, () => {
  mixer({
    convertEntities: true,
    removeWidows: false,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `minutes ${rawReplacementMark} we`, opt).res,
      "minutes &mdash; we",
      `109.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test(`110 - opts.convertApostrophes - replacement marks`, () => {
  mixer({
    convertEntities: true,
    removeWidows: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `minutes ${rawReplacementMark} we`, opt).res,
      "minutes&nbsp;&mdash; we",
      `110.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test(`111 - opts.convertApostrophes - replacement marks`, () => {
  mixer({
    convertEntities: false,
    removeWidows: true,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `minutes ${rawReplacementMark} we`, opt).res,
      `minutes${rawNbsp}${rawMDash} we`,
      `111.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test(`112 - opts.convertApostrophes - replacement marks`, () => {
  mixer({
    convertEntities: false,
    removeWidows: false,
    convertDashes: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `minutes ${rawReplacementMark} we`, opt).res,
      `minutes ${rawMDash} we`,
      `112.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test(`113 - opts.convertApostrophes - replacement marks`, () => {
  mixer({
    convertEntities: true,
    removeWidows: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `minutes ${rawReplacementMark} we`, opt).res,
      "minutes - we",
      `113.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test(`114 - opts.convertApostrophes - replacement marks`, () => {
  mixer({
    convertEntities: true,
    removeWidows: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `minutes ${rawReplacementMark} we`, opt).res,
      "minutes&nbsp;- we",
      `114.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test(`115 - opts.convertApostrophes - replacement marks`, () => {
  mixer({
    convertEntities: false,
    removeWidows: true,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `minutes ${rawReplacementMark} we`, opt).res,
      `minutes${rawNbsp}- we`,
      `115.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test(`116 - opts.convertApostrophes - replacement marks`, () => {
  mixer({
    convertEntities: false,
    removeWidows: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `minutes ${rawReplacementMark} we`, opt).res,
      "minutes - we",
      `116.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

// 07. numeric entities
// -----------------------------------------------------------------------------

test(`117 - numeric entities - numeric entities`, () => {
  equal(
    det(ok, not, 0, "aaaaaaa aaaaaaaaa aaaaaaaaaa&#160;bbbb").res,
    "aaaaaaa aaaaaaaaa aaaaaaaaaa&nbsp;bbbb",
    "117.01",
  );
});

test(`118 - numeric entities - named entities`, () => {
  equal(
    det(ok, not, 0, "aaaaaaa aaaaaaaaa aaaaaaaaaa&nbsp;bbbb").res,
    "aaaaaaa aaaaaaaaa aaaaaaaaaa&nbsp;bbbb",
    "118.01",
  );
});

test(`119 - numeric entities - raw characters`, () => {
  equal(
    det(ok, not, 0, `aaaaaaa aaaaaaaaa aaaaaaaaa${rawNbsp}bbbb`).res,
    "aaaaaaa aaaaaaaaa aaaaaaaaa&nbsp;bbbb",
    "119.01",
  );
});

// 08. erroneous entities
// -----------------------------------------------------------------------------

test(`120 - erroneous entities - potentially clashing incomplete named entities - precaution &fnof; (\\u0192)`, () => {
  equal(det(ok, not, 0, "aaa&fnof;aaa").res, "aaa&fnof;aaa", "120.01");
});

test(`121 - erroneous entities - potentially clashing incomplete named entities`, () => {
  equal(det(ok, not, 0, "aaa&thinsp;aaa").res, "aaa aaa", "121.01");
});

test(`122 - erroneous entities - potentially clashing incomplete named entities`, () => {
  equal(det(ok, not, 0, "aaa&zwnjaaa").res, "aaa&zwnj;aaa", "122.01");
});

test(`123 - erroneous entities - potentially clashing incomplete named entities`, () => {
  equal(
    det(ok, not, 0, "aaa&pi&piv&pi&pivaaa", {
      convertEntities: false,
    }).res,
    "aaa\u03C0\u03D6\u03C0\u03D6aaa",
    "123.01",
  );
});

test(`124 - erroneous entities - potentially clashing incomplete named entities`, () => {
  equal(
    det(ok, not, 0, "aaa&pi&piv&pi&pivaaa", {
      convertEntities: true,
      dontEncodeNonLatin: false,
    }).res,
    "aaa&pi;&piv;&pi;&piv;aaa",
    "124.01",
  );
});

test(`125 - erroneous entities - precaution against false positives`, () => {
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
        opt,
      ).res,
      `Zzz times; Zzzz or; Zzzzzz real; Zzzz alpha; Zzzzz exist; Zzzzz${rawNbsp}euro;`,
      "125.01",
    );
  });
});

test(`126 - erroneous entities - potentially clashing incomplete named entities`, () => {
  equal(
    det(ok, not, 0, "aaa&sup&sup1&sup&sup2&sup&sup3&sup&supeaaa").res,
    "aaa&sup;&sup1;&sup;&sup2;&sup;&sup3;&sup;&supe;aaa",
    "126.01",
  );
});

test(`127 - erroneous entities - potentially clashing incomplete named entities`, () => {
  equal(
    det(ok, not, 0, "aaa&theta&thetasym&theta&thetasymaaa", {
      convertEntities: false,
    }).res,
    he.decode("aaa&theta;&thetasym;&theta;&thetasym;aaa"),
    "127.01",
  );
});

test(`128 - erroneous entities - potentially clashing incomplete named entities`, () => {
  equal(
    det(ok, not, 0, "aaa&ang&angst&ang&angstaaa").res,
    "aaa&ang;&#xC5;&ang;&#xC5;aaa",
    "128.01",
  );
});

// 09. sanity checks
// -----------------------------------------------------------------------------

test(`129 - sanity checks - checking if entity references are left intact`, () => {
  equal(det(ok, not, 0, "aaa&lt;bbb ccc").res, "aaa&lt;bbb ccc", "129.01");
});

test(`130 - sanity checks - checking if entity references are left intact`, () => {
  equal(
    det(ok, not, 0, "aaa&lt;bbb ccc", {
      convertEntities: true,
    }).res,
    "aaa&lt;bbb ccc",
    "130.01",
  );
});

test(`131 - sanity checks - checking if entity references are left intact`, () => {
  equal(
    det(ok, not, 0, "aaa&lt;bbb ccc", {
      convertEntities: false,
    }).res,
    "aaa<bbb ccc",
    "131.01",
  );
});

test(`132 - sanity checks - checking if entity references are left intact`, () => {
  equal(det(ok, not, 0, "aaa<bbb ccc").res, "aaa&lt;bbb ccc", "132.01");
});

test(`133 - sanity checks - checking if entity references are left intact`, () => {
  equal(
    det(ok, not, 0, "aaa<bbb ccc", { convertEntities: true }).res,
    "aaa&lt;bbb ccc",
    "133.01",
  );
});

test(`134 - sanity checks - checking if entity references are left intact`, () => {
  equal(
    det(ok, not, 0, "aaa<bbb ccc", { convertEntities: false }).res,
    "aaa<bbb ccc",
    "134.01",
  );
});

test(`135 - sanity checks - precaution against false positives`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Zzz times; Zzzz or; Zzzzzz real; Zzzz alpha; Zzzzz exist; Zzzzz euro;",
        opt,
      ).res,
      "Zzz times; Zzzz or; Zzzzzz real; Zzzz alpha; Zzzzz exist; Zzzzz euro;",
      `135.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test(`136 - sanity checks - precaution against false positives`, () => {
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
        opt,
      ).res,
      "Zzz times; Zzzz or; Zzzzzz real; Zzzz alpha; Zzzzz exist; Zzzzz&nbsp;euro;",
      `136.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

// ============================================================================
// 10. some HTML entitities can't be sent in named entities format, only in numeric
// ============================================================================

test("137 - email-not-friendly entities", () => {
  equal(
    det(ok, not, 0, "&Breve;", { convertEntities: true }).res,
    "&#x2D8;",
    "137.01",
  );
});

test("138 - email-not-friendly entities", () => {
  equal(
    det(ok, not, 0, "&Breve;", { convertEntities: false }).res,
    "\u02D8",
    "138.01",
  );
});

test("139 - numeric entities", () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "&Breve;&Backslash;&Cacute;&CircleDot;&DD;&Diamond;&DownArrow;&LT;&RightArrow;&SmallCircle;&Uarr;&Verbar;&angst;&zdot; a",
        opt,
      ).res,
      "&#x2D8;&#x2216;&#x106;&#x2299;&#x2145;&#x22C4;&darr;&lt;&rarr;&#x2218;&#x219F;&#x2016;&#xC5;&#x17C; a",
      `139.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("140 - wrong named entity QUOT into quot", () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&QUOT;", opt).res,
      "&quot;",
      `140.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("141 - enforce spaces after semicolons - semicol between letters, addMissingSpaces=on", () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaa;aaa", opt).res,
      "aaa; aaa",
      `141.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("142 - enforce spaces after semicolons - semicol between letters, addMissingSpaces=off", () => {
  mixer({
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaa;aaa", opt).res,
      "aaa;aaa",
      `142.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("143 - enforce spaces after semicolons - semicol between letters, ends with semicol", () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaa;aaa;", opt).res,
      "aaa; aaa;",
      `143.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("144 - enforce spaces after semicolons - semicol between letters, ends with semicol", () => {
  mixer({
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaa;aaa;", opt).res,
      "aaa;aaa;",
      `144.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("145 - enforce spaces after semicolons - semicol fixes must not affect HTML entities", () => {
  mixer({
    convertEntities: true,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaa&nbsp;aaa", opt).res,
      "aaa&nbsp;aaa",
      `145.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("146 - enforce spaces after dot if upper-case letter follows", () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaa.Aaa", opt).res,
      "aaa. Aaa",
      `146.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("147 - does not touch dots among lowercase letters", () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaa.aaa", opt).res,
      "aaa.aaa",
      `147.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("148 - letters within ASCII are decoded if come encoded", () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "&#x61;", opt).res,
      "a",
      `148.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test.run();
