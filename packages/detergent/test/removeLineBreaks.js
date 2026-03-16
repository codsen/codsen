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
import { compare } from "../../../ops/helpers/shallow-compare.js";
import { det as realDet } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

// see https://en.wikipedia.org/wiki/Newline#Representation

// -----------------------------------------------------------------------------

test("001 - opts.removeLineBreaks - minimal, removeLineBreaks=on", () => {
  mixer({
    removeLineBreaks: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "a\nb", opt).res, "a b", "001.01");
  });
});

test("002 - opts.removeLineBreaks - minimal, removeLineBreaks=off", () => {
  equal(
    realDet("a\rb", {
      removeLineBreaks: false,
      replaceLineBreaks: false,
    }).res,
    "a\rb",
    "002.01",
  );
  mixer({
    removeLineBreaks: false,
    replaceLineBreaks: false,
    eol: undefined,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "a\nb", opt).res, "a\nb", "002.02");
    equal(det(ok, not, n, "a\rb", opt).res, "a\rb", "002.03");
    equal(det(ok, not, n, "a\r\nb", opt).res, "a\r\nb", "002.04");
  });
});

test("003 - opts.removeLineBreaks - Unix style (LF or \\n)", () => {
  mixer({
    removeLineBreaks: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "\n\n\ntralala\ntralala2\ntralala3\n\n\ntralala4\n\n\n",
        opt,
      ).res,
      "tralala tralala2 tralala3 tralala4",
      "003.01",
    );
  });
});

test("004 - opts.removeLineBreaks - Unix style (LF or \\n)", () => {
  mixer({
    removeLineBreaks: true,
    removeWidows: true,
    convertEntities: true,
    eol: undefined,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "\n\n\ntralala\ntralala2\ntralala3\n\n\ntralala4\n\n\n",
        opt,
      ).res,
      "tralala tralala2 tralala3&nbsp;tralala4",
      "004.01",
    );
  });

  not.ok(
    realDet("\n\n\ntralala\ntralala2\ntralala3\n\n\ntralala4\n\n\n", {
      removeLineBreaks: true,
      removeWidows: true,
      convertEntities: true,
    }).applicableOpts.eol,
    "04.03",
  );

  not.ok(
    realDet("\n\n\na\nb\nc\n\n\nd\n\n\n", {
      removeLineBreaks: true,
      removeWidows: true,
      convertEntities: true,
    }).applicableOpts.replaceLineBreaks,
    "04.04",
  );

  not.ok(
    realDet("\n\n\na\nb\nc\n\n\nd\n\n\n", {
      removeLineBreaks: true,
      removeWidows: true,
      convertEntities: true,
    }).applicableOpts.useXHTML,
    "04.05",
  );

  compare(
    ok,
    realDet("\n\n\ntralala\ntralala2\ntralala3\n\n\ntralala4\n\n\n", {
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
    "04.06",
  );
});

test("005 - opts.removeLineBreaks - DOS style (CRLF or \\r\\n)", () => {
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
        opt,
      ).res,
      "tralala tralala2 tralala3 tralala4",
      "005.01",
    );
  });
});

test("006 - opts.removeLineBreaks - DOS style (CRLF or \\r\\n)", () => {
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
        opt,
      ).res,
      `tralala tralala2 tralala3${rawNbsp}tralala4`,
      "006.01",
    );
  });
});

test("007 - opts.removeLineBreaks - clasic Mac OS style (CR or \\r only)", () => {
  mixer({
    removeLineBreaks: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "\r\r\rtralala\rtralala2\rtralala3\r\r\rtralala4\r\r\r",
        opt,
      ).res,
      "tralala tralala2 tralala3 tralala4",
      "007.01",
    );
  });
});

test("008 - opts.removeLineBreaks - clasic Mac OS style (CR or \\r only)", () => {
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
        "\r\r\rtralala\rtralala2\rtralala3\r\r\rtralala4\r\r\r",
        opt,
      ).res,
      "tralala tralala2 tralala3&nbsp;tralala4",
      "008.01",
    );
  });
});

test.run();
