import tap from "tap";
// import { det as det1 } from "../dist/detergent.esm.js";
import {
  det,
  mixer,
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  rawNbsp,
  // rawhairspace,
  // rawEllipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote
} from "../t-util/util.js";

tap.test(`01 - front & back spaces stripped`, (t) => {
  mixer().forEach((opt, n) => {
    t.equal(
      det(t, n, `\n\n \t     aaaaaa   \n\t\t  `, opt).res,
      "aaaaaa",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`02 - redundant space between words`, (t) => {
  mixer().forEach((opt, n) => {
    t.equal(
      det(t, n, `aaaaaa     bbbbbb`, opt).res,
      "aaaaaa bbbbbb",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`03 - trailing/leading whitespace, convertEntities=on`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `&nbsp; a b`, opt).res,
      "&nbsp; a b",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`04 - trailing/leading whitespace, convertEntities=on`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `a b &nbsp;`, opt).res,
      "a b &nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`05 - trailing/leading whitespace, convertEntities=on`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `&nbsp; a &nbsp;`, opt).res,
      "&nbsp; a &nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`06 - trailing/leading whitespace, convertEntities=on`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `    ${rawNbsp}     a     ${rawNbsp}      `, opt).res,
      "&nbsp; a &nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`07 - trailing/leading whitespace, convertEntities=on`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;`, opt).res,
      "&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`08 - trailing/leading whitespace, convertEntities=on`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, ` &nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp; `, opt).res,
      "&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`09 - trailing/leading whitespace, convertEntities=off`, (t) => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `&nbsp; a b`, opt).res,
      `${rawNbsp} a b`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`10 - trailing/leading whitespace, convertEntities=off`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `a b &nbsp;`, opt).res,
      `a b &nbsp;`,
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `a b &nbsp;`, opt).res,
      `a b ${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`11`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `    &nbsp; a &nbsp;     `, opt).res,
      `&nbsp; a &nbsp;`,
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `    &nbsp; a &nbsp;     `, opt).res,
      `${rawNbsp} a ${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`12 - trailing/leading whitespace, convertEntities=off`, (t) => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `    ${rawNbsp}     a     ${rawNbsp}           `, opt).res,
      `${rawNbsp} a ${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`13 - trailing/leading whitespace, convertEntities=off`, (t) => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(
        t,
        n,
        `${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp}`,
        opt
      ).res,
      `${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`14 - trailing/leading whitespace, convertEntities=off`, (t) => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(
        t,
        n,
        ` ${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp} `,
        opt
      ).res,
      `${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`15 - ETX - useXHTML=on`, (t) => {
  mixer({
    removeLineBreaks: false,
    replaceLineBreaks: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `first\u0003second`, opt).res,
      `first<br/>\nsecond`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`16 - ETX - useXHTML=off`, (t) => {
  mixer({
    removeLineBreaks: false,
    replaceLineBreaks: true,
    useXHTML: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `first\u0003second`, opt).res,
      "first<br>\nsecond",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`17 - ETX - replaceLineBreaks=off`, (t) => {
  mixer({
    removeLineBreaks: false,
    replaceLineBreaks: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `first\u0003second`, opt).res,
      "first\nsecond",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`18 - strips UTF8 BOM`, (t) => {
  mixer().forEach((opt, n) => {
    t.equal(
      det(t, n, `\uFEFFunicorn`, opt).res,
      "unicorn",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`19 - strips UTF8 BOM`, (t) => {
  mixer().forEach((opt, n) => {
    t.equal(
      det(t, n, `unicorn\uFEFF`, opt).res,
      "unicorn",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`20 - strips UTF8 BOM`, (t) => {
  mixer().forEach((opt, n) => {
    t.equal(
      det(t, n, `unicorn\uFEFFzzz`, opt).res,
      "unicornzzz",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});
