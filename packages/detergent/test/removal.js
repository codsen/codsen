import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";
import {
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  rawNbsp,
  // rawHairspace,
  // rawEllipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote,
} from "codsen-utils";

test(`01 - front & back spaces stripped`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, `\n\n \t     aaaaaa   \n\t\t  `, opt).res,
      "aaaaaa",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`02 - redundant space between words`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaaaaa     bbbbbb`, opt).res,
      "aaaaaa bbbbbb",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03 - trailing/leading whitespace, convertEntities=on`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `&nbsp; a b`, opt).res,
      "&nbsp; a b",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`04 - trailing/leading whitespace, convertEntities=on`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a b &nbsp;`, opt).res,
      "a b &nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`05 - trailing/leading whitespace, convertEntities=on`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `&nbsp; a &nbsp;`, opt).res,
      "&nbsp; a &nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`06 - trailing/leading whitespace, convertEntities=on`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `    ${rawNbsp}     a     ${rawNbsp}      `, opt).res,
      "&nbsp; a &nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07 - trailing/leading whitespace, convertEntities=on`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;`, opt).res,
      "&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`08 - trailing/leading whitespace, convertEntities=on`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, ` &nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp; `, opt).res,
      "&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`09 - trailing/leading whitespace, convertEntities=off`, () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `&nbsp; a b`, opt).res,
      `${rawNbsp} a b`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`10 - trailing/leading whitespace, convertEntities=off`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a b &nbsp;`, opt).res,
      `a b &nbsp;`,
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a b &nbsp;`, opt).res,
      `a b ${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`11`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `    &nbsp; a &nbsp;     `, opt).res,
      `&nbsp; a &nbsp;`,
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `    &nbsp; a &nbsp;     `, opt).res,
      `${rawNbsp} a ${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`12 - trailing/leading whitespace, convertEntities=off`, () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `    ${rawNbsp}     a     ${rawNbsp}           `, opt)
        .res,
      `${rawNbsp} a ${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`13 - trailing/leading whitespace, convertEntities=off`, () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp}`,
        opt
      ).res,
      `${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`14 - trailing/leading whitespace, convertEntities=off`, () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        ` ${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp} `,
        opt
      ).res,
      `${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`15 - ETX - useXHTML=on`, () => {
  mixer({
    removeLineBreaks: false,
    replaceLineBreaks: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `first\u0003second`, opt).res,
      `first<br/>\nsecond`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`16 - ETX - useXHTML=off`, () => {
  mixer({
    removeLineBreaks: false,
    replaceLineBreaks: true,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `first\u0003second`, opt).res,
      "first<br>\nsecond",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`17 - ETX - replaceLineBreaks=off`, () => {
  mixer({
    removeLineBreaks: false,
    replaceLineBreaks: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `first\u0003second`, opt).res,
      "first\nsecond",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`18 - strips UTF8 BOM`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, `\uFEFFunicorn`, opt).res,
      "unicorn",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`19 - strips UTF8 BOM`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, `unicorn\uFEFF`, opt).res,
      "unicorn",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`20 - strips UTF8 BOM`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, `unicorn\uFEFFzzz`, opt).res,
      "unicornzzz",
      JSON.stringify(opt, null, 0)
    );
  });
});

test.run();
