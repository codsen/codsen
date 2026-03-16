// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import {
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  rawNbsp,
  // hairspace,
  // ellipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote,
} from "codsen-utils";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
// import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

test("001 - front & back spaces stripped", () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "\n\n \t     aaaaaa   \n\t\t  ", opt).res,
      "aaaaaa",
      `001.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("002 - redundant space between words", () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaaaaa     bbbbbb", opt).res,
      "aaaaaa bbbbbb",
      `002.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("003 - trailing/leading whitespace, convertEntities=on", () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&nbsp; a b", opt).res,
      "&nbsp; a b",
      `003.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("004 - trailing/leading whitespace, convertEntities=on", () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a b &nbsp;", opt).res,
      "a b &nbsp;",
      `004.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("005 - trailing/leading whitespace, convertEntities=on", () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&nbsp; a &nbsp;", opt).res,
      "&nbsp; a &nbsp;",
      `005.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("006 - trailing/leading whitespace, convertEntities=on", () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `    ${rawNbsp}     a     ${rawNbsp}      `, opt).res,
      "&nbsp; a &nbsp;",
      `006.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("007 - trailing/leading whitespace, convertEntities=on", () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;", opt).res,
      "&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;",
      `007.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("008 - trailing/leading whitespace, convertEntities=on", () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, " &nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp; ", opt).res,
      "&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;",
      `008.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("009 - trailing/leading whitespace, convertEntities=off", () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&nbsp; a b", opt).res,
      `${rawNbsp} a b`,
      `009.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("010 - trailing/leading whitespace, convertEntities=off", () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a b &nbsp;", opt).res,
      "a b &nbsp;",
      `010.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a b &nbsp;", opt).res,
      `a b ${rawNbsp}`,
      `010.02 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("011", () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "    &nbsp; a &nbsp;     ", opt).res,
      "&nbsp; a &nbsp;",
      `011.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "    &nbsp; a &nbsp;     ", opt).res,
      `${rawNbsp} a ${rawNbsp}`,
      `011.02 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("012 - trailing/leading whitespace, convertEntities=off", () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `    ${rawNbsp}     a     ${rawNbsp}           `, opt)
        .res,
      `${rawNbsp} a ${rawNbsp}`,
      `012.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("013 - trailing/leading whitespace, convertEntities=off", () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp}`,
        opt,
      ).res,
      `${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp}`,
      `013.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("014 - trailing/leading whitespace, convertEntities=off", () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        ` ${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp} `,
        opt,
      ).res,
      `${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp}`,
      `014.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("015 - ETX - useXHTML=on", () => {
  mixer({
    removeLineBreaks: false,
    replaceLineBreaks: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "first\u0003second", opt).res,
      "first<br/>\nsecond",
      `015.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("016 - ETX - useXHTML=off", () => {
  mixer({
    removeLineBreaks: false,
    replaceLineBreaks: true,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "first\u0003second", opt).res,
      "first<br>\nsecond",
      `016.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("017 - ETX - replaceLineBreaks=off", () => {
  mixer({
    removeLineBreaks: false,
    replaceLineBreaks: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "first\u0003second", opt).res,
      "first\nsecond",
      `017.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("018 - strips UTF8 BOM", () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "\uFEFFunicorn", opt).res,
      "unicorn",
      `018.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("019 - strips UTF8 BOM", () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "unicorn\uFEFF", opt).res,
      "unicorn",
      `019.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("020 - strips UTF8 BOM", () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "unicorn\uFEFFzzz", opt).res,
      "unicornzzz",
      `020.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test.run();
