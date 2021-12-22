import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { det as det1 } from "../dist/detergent.esm.js";
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

// see https://en.wikipedia.org/wiki/Newline#Representation

// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - minimal, removeLineBreaks=on`, () => {
  mixer({
    removeLineBreaks: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a\nb`, opt).res,
      "a b",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`02 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - minimal, removeLineBreaks=off`, () => {
  mixer({
    removeLineBreaks: false,
    replaceLineBreaks: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a\nb`, opt).res,
      "a\nb",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - Unix style (LF or \\n)`, () => {
  mixer({
    removeLineBreaks: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `\n\n\ntralala\ntralala2\ntralala3\n\n\ntralala4\n\n\n`,
        opt
      ).res,
      "tralala tralala2 tralala3 tralala4",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`04 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - Unix style (LF or \\n)`, () => {
  mixer({
    removeLineBreaks: true,
    removeWidows: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `\n\n\ntralala\ntralala2\ntralala3\n\n\ntralala4\n\n\n`,
        opt
      ).res,
      "tralala tralala2 tralala3&nbsp;tralala4",
      JSON.stringify(opt, null, 0)
    );
  });

  equal(
    det1(`\n\n\ntralala\ntralala2\ntralala3\n\n\ntralala4\n\n\n`, {
      removeLineBreaks: true,
      removeWidows: true,
      convertEntities: true,
      eol: true,
    }).res,
    det1(`\n\n\ntralala\ntralala2\ntralala3\n\n\ntralala4\n\n\n`, {
      removeLineBreaks: true,
      removeWidows: true,
      convertEntities: true,
      eol: false,
    }).res,
    "04.01"
  );

  not.ok(
    det1(`\n\n\ntralala\ntralala2\ntralala3\n\n\ntralala4\n\n\n`, {
      removeLineBreaks: true,
      removeWidows: true,
      convertEntities: true,
    }).applicableOpts.eol,
    "04.02"
  );

  not.ok(
    det1(`\n\n\na\nb\nc\n\n\nd\n\n\n`, {
      removeLineBreaks: true,
      removeWidows: true,
      convertEntities: true,
    }).applicableOpts.replaceLineBreaks,
    "04.03"
  );

  not.ok(
    det1(`\n\n\na\nb\nc\n\n\nd\n\n\n`, {
      removeLineBreaks: true,
      removeWidows: true,
      convertEntities: true,
    }).applicableOpts.useXHTML,
    "04.04"
  );

  compare(
    ok,
    det1(`\n\n\ntralala\ntralala2\ntralala3\n\n\ntralala4\n\n\n`, {
      removeLineBreaks: true,
      removeWidows: true,
      convertEntities: true,
    }),
    {
      res: "tralala tralala2 tralala3&nbsp;tralala4",
      applicableOpts: {
        fixBrokenEntities: false,
        removeWidows: true,
        convertEntities: true,
        convertDashes: false,
        convertApostrophes: false,
        replaceLineBreaks: false,
        removeLineBreaks: true,
        useXHTML: false,
        dontEncodeNonLatin: false,
        addMissingSpaces: false,
        convertDotsToEllipsis: false,
        stripHtml: false,
        eol: false,
      },
    },
    "04.05"
  );
});

test(`05 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - DOS style (CRLF or \\r\\n)`, () => {
  mixer({
    removeLineBreaks: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "\r\n\r\n\r\ntralala\r\ntralala2\r\ntralala3\r\n\r\n\r\ntralala4\r\n\r\n\r\n",
        opt
      ).res,
      "tralala tralala2 tralala3 tralala4",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`06 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - DOS style (CRLF or \\r\\n)`, () => {
  mixer({
    removeLineBreaks: true,
    removeWidows: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "\r\n\r\n\r\ntralala\r\ntralala2\r\ntralala3\r\n\r\n\r\ntralala4\r\n\r\n\r\n",
        opt
      ).res,
      `tralala tralala2 tralala3${rawNbsp}tralala4`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - clasic Mac OS style (CR or \\r only)`, () => {
  mixer({
    removeLineBreaks: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `\r\r\rtralala\rtralala2\rtralala3\r\r\rtralala4\r\r\r`,
        opt
      ).res,
      "tralala tralala2 tralala3 tralala4",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`08 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - clasic Mac OS style (CR or \\r only)`, () => {
  mixer({
    removeLineBreaks: true,
    removeWidows: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `\r\r\rtralala\rtralala2\rtralala3\r\r\rtralala4\r\r\r`,
        opt
      ).res,
      "tralala tralala2 tralala3&nbsp;tralala4",
      JSON.stringify(opt, null, 0)
    );
  });
});

test.run();
