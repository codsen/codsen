import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";
import {
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  // rawNbsp,
  rawHairspace,
  // rawEllipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote,
} from "codsen-utils";

test(`01 - empty string input`, () => {
  equal(det(ok, not, 0, "").res, "", "01.01");
});

test(`02 - all low ASCII invisible characters are removed`, () => {
  equal(
    det(
      ok,
      not,
      0,
      "\u0000\u0001\u0002\u0004\u0005\u0006\u0007\u0008\u000E\u000F\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001A\u001B\u001C\u001D\u001E\u001F\u007F\u0080\u0081\u0082\u0083\u0084\u0086\u0087\u0088\u0089\u008A\u008B\u008C\u008D\u008E\u008F\u0090\u0091\u0092\u0093\u0094\u0095\u0096\u0097\u0098\u0099\u009A\u009B\u009C\u009D\u009E\u009F\u200E\u200F"
    ).res,
    "",
    "02.01"
  );
});

test(`03 - hairspace - tight - hairspace changed to space`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `a&hairsp;a&VeryThinSpace;a&#x0200A;a&#8202;a${rawHairspace}a`,
        opt
      ).res,
      "a a a a a a",
      "03.01"
    );
  });
});

test(`04 - hairspace - tight - hairspace changed to space (lots of spaces)`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `a    &hairsp;  a  &VeryThinSpace;   a &#x0200A;     a              &#8202; a ${rawHairspace} a    `,
        opt
      ).res,
      "a a a a a a",
      "04.01"
    );
  });
});

test(`05 - hairspace - tight - hairspace changed to space: +widows+entities`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `a&hairsp;b&VeryThinSpace;c&#x0200A;d&#8202;e${rawHairspace}f`,
        opt
      ).res,
      "a b c d e&nbsp;f",
      "05.01"
    );
  });
});

test("06 - invisible breaks - raw", () => {
  mixer({
    replaceLineBreaks: false,
    removeLineBreaks: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a\u000Ab\u000Bc\u000Cd\u000De\u2028f\u2029g\u0003h", opt)
        .res,
      "a\nb\nc\nd\ne\nf\ng\nh",
      "06.01"
    );
  });
});

test("07 - invisible breaks - encoded decimal HTML entities", () => {
  mixer({
    replaceLineBreaks: false,
    removeLineBreaks: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a&#10;b&#11;c&#12;&#13;&#8232;&#8233;&#3;d", opt).res,
      "a\nb\nc\n\nd",
      "07.01"
    );
  });
});

test("08 - invisible breaks - remove all line breaks on", () => {
  mixer({
    removeLineBreaks: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a\u000Eb\u000C\u000D\u0085c\u2028\u2029d", opt).res,
      "ab cd",
      "08.01"
    );
  });
});

test("09 - invisible breaks - replace breaks into XHTML BR's", () => {
  mixer({
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a\u000Ab\u000Bc\u000C\u000D\u0085\u2028\u2029d", opt)
        .res,
      "a<br/>\nb\nc<br/>\n\nd",
      "09.01"
    );
  });
});

test("10 - invisible breaks - replace breaks into HTML BR's", () => {
  mixer({
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a\u000Ab\u000Bc\u000C\u000D\u0085\u2028\u2029d", opt)
        .res,
      "a<br>\nb\nc<br>\n\nd",
      "10.01"
    );
  });
});

test("11 - line feed \\u000A (LF) and o.removeLineBreaks", () => {
  mixer({
    replaceLineBreaks: false,
    removeLineBreaks: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "aaa\u000Abbb", opt).res, "aaa bbb", "11.01");
  });
});

test("12 - line feed \\u000A (LF) and no o.removeLineBreaks", () => {
  mixer({
    replaceLineBreaks: false,
    removeLineBreaks: false,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "aaa\u000Abbb", opt).res, "aaa\nbbb", "12.01");
  });
});

test("13 - narrow no break space", () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "a\u202Fb", opt).res, "a b", "13.01");
  });
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "a\u202Fb", opt).res, "a b", "12");
  });
});

test.run();
