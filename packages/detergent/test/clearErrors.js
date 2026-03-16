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

test("001 - fixes - space - full stop, removeWidows=off", () => {
  mixer({
    removeWidows: false,
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
        opt,
      ).res,
      "Very long line, long-enough to trigger widow removal.<br/>\n<br/>\nText.",
      `001.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("002 - fixes - space - full stop, removeWidows=on", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
        opt,
      ).res,
      "Very long line, long-enough to trigger widow&nbsp;removal.<br/>\n<br/>\nText.",
      `002.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("003 - fixes - space - full stop, convertEntities=off", () => {
  mixer({
    removeWidows: true,
    convertEntities: false,
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
        opt,
      ).res,
      `Very long line, long-enough to trigger widow${rawNbsp}removal.<br/>\n<br/>\nText.`,
      `003.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("004 - fixes - space - full stop, removeLineBreaks=off", () => {
  mixer({
    removeWidows: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
        opt,
      ).res,
      "Very long line, long-enough to trigger widow removal.\n\nText.",
      `004.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("005 - fixes - space - full stop, convertEntities=on", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
        opt,
      ).res,
      "Very long line, long-enough to trigger widow&nbsp;removal.\n\nText.",
      `005.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("006 - fixes - space - full stop, convertEntities=off", () => {
  mixer({
    removeWidows: true,
    convertEntities: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
        opt,
      ).res,
      `Very long line, long-enough to trigger widow${rawNbsp}removal.\n\nText.`,
      `006.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("007 - fixes - space - full stop, removeWidows=off, replaceLineBreaks=on", () => {
  mixer({
    removeWidows: false,
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
        opt,
      ).res,
      "Very long line, long-enough to trigger widow removal.<br>\n<br>\nText.",
      `007.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("008 - fixes - space - full stop, removeWidows=on, replaceLineBreaks=on", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
        opt,
      ).res,
      "Very long line, long-enough to trigger widow&nbsp;removal.<br>\n<br>\nText.",
      `008.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("009 - fixes - space - full stop, removeWidows=on, replaceLineBreaks=on, convertEntities=off", () => {
  mixer({
    removeWidows: true,
    convertEntities: false,
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
        opt,
      ).res,
      `Very long line, long-enough to trigger widow${rawNbsp}removal.<br>\n<br>\nText.`,
      `009.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("010 - fixes - space - full stop, removeWidows=off, removeLineBreaks=on - LF", () => {
  mixer({
    removeWidows: false,
    removeLineBreaks: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        " \u000a    Very long line, long-enough to trigger widow removal   \n\n. \u000a\n Text text text text . ",
        opt,
      ).res,
      "Very long line, long-enough to trigger widow removal. Text text text text.",
      `010.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("011 - fixes - space - full stop, removeWidows=off, removeLineBreaks=on - CR", () => {
  mixer({
    removeWidows: false,
    removeLineBreaks: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        " \u000a    Very long line, long-enough to trigger widow removal   \r\r. \u000a\n Text text text text . ",
        opt,
      ).res,
      "Very long line, long-enough to trigger widow removal. Text text text text.",
      `011.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("012 - fixes - space - full stop, removeWidows=off, removeLineBreaks=on - CRLF", () => {
  mixer({
    removeWidows: false,
    removeLineBreaks: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        " \u000a    Very long line, long-enough to trigger widow removal   \r\n\r\n. \u000a\n Text text text text . ",
        opt,
      ).res,
      "Very long line, long-enough to trigger widow removal. Text text text text.",
      `012.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("013 - fixes - space - full stop, removeWidows=on, removeLineBreaks=on", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    removeLineBreaks: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        " \u000a    Very long line, long-enough to trigger widow removal .  \n \n \u000a\n Text text text text . ",
        opt,
      ).res,
      "Very long line, long-enough to trigger widow removal. Text text text&nbsp;text.",
      `013.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("014 - fixes - space - full stop, removeWidows=on, convertEntities=off", () => {
  mixer({
    removeWidows: true,
    convertEntities: false,
    removeLineBreaks: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        " \u000a   Very long line, long-enough to trigger widow removal .  \n \n  \u000a\n Text text text text . ",
        opt,
      ).res,
      `Very long line, long-enough to trigger widow removal. Text text text${rawNbsp}text.`,
      `014.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("015 - fixes - line break combinations", () => {
  equal(det(ok, not, 0, "a. \na").res, "a.<br/>\na", "015.01");
});

test("016 - fixes - line break combinations", () => {
  equal(det(ok, not, 0, "a . \na").res, "a.<br/>\na", "016.01");
});

test("017 - fixes - line break combinations", () => {
  equal(det(ok, not, 0, "a , \na").res, "a,<br/>\na", "017.01");
});

test("018 - fixes - checking line feed being replaced with space", () => {
  mixer({
    removeLineBreaks: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaaa\u000Abbbbb", opt).res,
      "aaaa bbbbb",
      `018.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test.run();
