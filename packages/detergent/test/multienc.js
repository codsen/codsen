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
  // hairspace,
  // ellipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote,
} from "codsen-utils";

test(`01 - recursive entity de-coding, convertEntities=off`, () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `&amp;nbsp;`, opt).res,
      `${rawNbsp}`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`02 - recursive entity de-coding, convertEntities=off`, () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `&amp;pound;`, opt).res,
      "£",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`03 - recursive entity de-coding, convertEntities=off`, () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `&amp;amp;amp;amp;pound;`, opt).res,
      "£",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`04 - recursive entity de-coding, convertEntities=off`, () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `&#x26;#xA9;`, opt).res,
      "©",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`05 - recursive entity de-coding, convertEntities=off`, () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a&#x26;#x26;amp;b`, opt).res,
      "a&b",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`06 - recursive entity de-coding, convertEntities=on`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `&amp;nbsp;`, opt).res,
      "&nbsp;",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`07 - recursive entity de-coding, convertEntities=on`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `&amp;pound;`, opt).res,
      "&pound;",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`08 - recursive entity de-coding, convertEntities=on`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `&amp;amp;amp;amp;pound;`, opt).res,
      "&pound;",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`09 - recursive entity de-coding, convertEntities=on`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `&#x26;#xA9;`, opt).res,
      "&copy;",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`10 - recursive entity de-coding, convertEntities=on`, () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a&#x26;#x26;amp;b`, opt).res,
      "a&amp;b",
      JSON.stringify(opt, null, 0)
    );
  });
});

test.run();
