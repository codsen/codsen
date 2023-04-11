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

test(`01 - ${`\u001b[${32}m${"fixes"}\u001b[${39}m`} - space - full stop, removeWidows=off`, () => {
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
        opt
      ).res,
      "Very long line, long-enough to trigger widow removal.<br/>\n<br/>\nText.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`02 - ${`\u001b[${32}m${"fixes"}\u001b[${39}m`} - space - full stop, removeWidows=on`, () => {
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
        opt
      ).res,
      "Very long line, long-enough to trigger widow&nbsp;removal.<br/>\n<br/>\nText.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03 - ${`\u001b[${32}m${"fixes"}\u001b[${39}m`} - space - full stop, convertEntities=off`, () => {
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
        opt
      ).res,
      `Very long line, long-enough to trigger widow${rawNbsp}removal.<br/>\n<br/>\nText.`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`04 - ${`\u001b[${32}m${"fixes"}\u001b[${39}m`} - space - full stop, removeLineBreaks=off`, () => {
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
        opt
      ).res,
      "Very long line, long-enough to trigger widow removal.\n\nText.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`05 - ${`\u001b[${32}m${"fixes"}\u001b[${39}m`} - space - full stop, convertEntities=on`, () => {
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
        opt
      ).res,
      "Very long line, long-enough to trigger widow&nbsp;removal.\n\nText.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`06 - ${`\u001b[${32}m${"fixes"}\u001b[${39}m`} - space - full stop, convertEntities=off`, () => {
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
        opt
      ).res,
      `Very long line, long-enough to trigger widow${rawNbsp}removal.\n\nText.`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07 - ${`\u001b[${32}m${"fixes"}\u001b[${39}m`} - space - full stop, removeWidows=off, replaceLineBreaks=on`, () => {
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
        opt
      ).res,
      "Very long line, long-enough to trigger widow removal.<br>\n<br>\nText.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`08 - ${`\u001b[${32}m${"fixes"}\u001b[${39}m`} - space - full stop, removeWidows=on, replaceLineBreaks=on`, () => {
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
        opt
      ).res,
      "Very long line, long-enough to trigger widow&nbsp;removal.<br>\n<br>\nText.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`09 - ${`\u001b[${32}m${"fixes"}\u001b[${39}m`} - space - full stop, removeWidows=on, replaceLineBreaks=on, convertEntities=off`, () => {
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
        opt
      ).res,
      `Very long line, long-enough to trigger widow${rawNbsp}removal.<br>\n<br>\nText.`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`10 - ${`\u001b[${32}m${"fixes"}\u001b[${39}m`} - space - full stop, removeWidows=off, removeLineBreaks=on - LF`, () => {
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
        opt
      ).res,
      "Very long line, long-enough to trigger widow removal. Text text text text.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`11 - ${`\u001b[${32}m${"fixes"}\u001b[${39}m`} - space - full stop, removeWidows=off, removeLineBreaks=on - CR`, () => {
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
        opt
      ).res,
      "Very long line, long-enough to trigger widow removal. Text text text text.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`12 - ${`\u001b[${32}m${"fixes"}\u001b[${39}m`} - space - full stop, removeWidows=off, removeLineBreaks=on - CRLF`, () => {
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
        opt
      ).res,
      "Very long line, long-enough to trigger widow removal. Text text text text.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`13 - ${`\u001b[${32}m${"fixes"}\u001b[${39}m`} - space - full stop, removeWidows=on, removeLineBreaks=on`, () => {
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
        opt
      ).res,
      "Very long line, long-enough to trigger widow removal. Text text text&nbsp;text.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`14 - ${`\u001b[${32}m${"fixes"}\u001b[${39}m`} - space - full stop, removeWidows=on, convertEntities=off`, () => {
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
        opt
      ).res,
      `Very long line, long-enough to trigger widow removal. Text text text${rawNbsp}text.`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`15 - ${`\u001b[${32}m${"fixes"}\u001b[${39}m`} - line break combinations`, () => {
  equal(det(ok, not, 0, "a. \na").res, "a.<br/>\na", "15.01");
});

test(`16 - ${`\u001b[${32}m${"fixes"}\u001b[${39}m`} - line break combinations`, () => {
  equal(det(ok, not, 0, "a . \na").res, "a.<br/>\na", "16.01");
});

test(`17 - ${`\u001b[${32}m${"fixes"}\u001b[${39}m`} - line break combinations`, () => {
  equal(det(ok, not, 0, "a , \na").res, "a,<br/>\na", "17.01");
});

test(`18 - ${`\u001b[${32}m${"fixes"}\u001b[${39}m`} - checking line feed being replaced with space`, () => {
  mixer({
    removeLineBreaks: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaaa\u000Abbbbb", opt).res,
      "aaaa bbbbb",
      JSON.stringify(opt, null, 0)
    );
  });
});

test.run();
