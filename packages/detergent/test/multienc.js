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

test("001 - recursive entity de-coding, convertEntities=off", () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&amp;nbsp;", opt).res,
      `${rawNbsp}`,
      `001.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("002 - recursive entity de-coding, convertEntities=off", () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&amp;pound;", opt).res,
      "£",
      `002.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("003 - recursive entity de-coding, convertEntities=off", () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&amp;amp;amp;amp;pound;", opt).res,
      "£",
      `003.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("004 - recursive entity de-coding, convertEntities=off", () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&#x26;#xA9;", opt).res,
      "©",
      `004.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("005 - recursive entity de-coding, convertEntities=off", () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a&#x26;#x26;amp;b", opt).res,
      "a&b",
      `005.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("006 - recursive entity de-coding, convertEntities=on", () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&amp;nbsp;", opt).res,
      "&nbsp;",
      `006.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("007 - recursive entity de-coding, convertEntities=on", () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&amp;pound;", opt).res,
      "&pound;",
      `007.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("008 - recursive entity de-coding, convertEntities=on", () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&amp;amp;amp;amp;pound;", opt).res,
      "&pound;",
      `008.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("009 - recursive entity de-coding, convertEntities=on", () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "&#x26;#xA9;", opt).res,
      "&copy;",
      `009.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("010 - recursive entity de-coding, convertEntities=on", () => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a&#x26;#x26;amp;b", opt).res,
      "a&amp;b",
      `010.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test.run();
