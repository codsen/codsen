import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

const key = ["crlf", "cr", "lf"];

// 01. basic tests on opts.replaceLineBreaks
// -----------------------------------------------------------------------------

test("01 - minimal example - correct existing linebreaks", () => {
  ["\r\n", "\r", "\n"].forEach((requestedEolType, idx1) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx2) => {
      mixer({
        replaceLineBreaks: true,
        removeLineBreaks: false,
        useXHTML: true,
        convertEntities: true,
        eol: key[idx1],
      }).forEach((opt, n) => {
        equal(
          det(ok, not, n, `a${presentEolType}b`, opt).res,
          `a<br/>${requestedEolType}b`,
          `present ${key[idx2]}, requested ${key[idx1]} --- ${JSON.stringify(
            opt,
            null,
            0,
          )}`,
        );
      });
    });
  });
});

test("02 - minimal example - br", () => {
  mixer({
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a<br/>b", opt).res,
      "a<br/>b",
      `${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("03 - replace \\n line breaks with BR - useXHTML=on", () => {
  ["\r\n", "\r", "\n"].forEach((eolType, i) => {
    mixer({
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: true,
      convertEntities: true,
    }).forEach((opt, n) => {
      equal(
        det(
          ok,
          not,
          n,
          `${eolType}${eolType}${eolType}tralala${eolType}tralala2${eolType}${eolType}tralala3${eolType}${eolType}${eolType}tralala4${eolType}${eolType}${eolType}`,
          opt,
        ).res,
        "tralala<br/>\ntralala2<br/>\n<br/>\ntralala3<br/>\n<br/>\ntralala4",
        `EOL: ${key[i]} --- ${JSON.stringify(opt, null, 0)}`,
      );
    });
  });
});

test("04 - replace \\n line breaks with BR - useXHTML=off", () => {
  ["\r\n", "\r", "\n"].forEach((eolType) => {
    mixer({
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: false,
      convertEntities: true,
    }).forEach((opt, n) => {
      equal(
        det(
          ok,
          not,
          n,
          `${eolType}${eolType}tralala${eolType}tralala2${eolType}${eolType}tralala3${eolType}${eolType}${eolType}tralala4${eolType}${eolType}${eolType}${eolType}`,
          opt,
        ).res,
        "tralala<br>\ntralala2<br>\n<br>\ntralala3<br>\n<br>\ntralala4",
        `${eolType} --- ${JSON.stringify(opt, null, 0)}`,
      );
    });
  });
});

test("05 - br with attribute, line break present", () => {
  ["\r\n", "\r", "\n"].forEach((eolType) => {
    mixer({
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: false,
      convertEntities: true,
      eol: undefined,
    }).forEach((opt, n) => {
      equal(
        det(ok, not, n, `a<br class="z">${eolType}b`, opt).res,
        `a<br class="z">${eolType}b`,
        `${JSON.stringify(eolType, null, 4)} --- ${JSON.stringify(
          opt,
          null,
          0,
        )}`,
      );
    });
  });
});

//                           1 x 4
// --------------------------------------------------------

test("06 - br with attribute, line break present - no eol setting", () => {
  equal(
    det1('a<br class="z">\r\nb', {
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: false,
      convertEntities: true,
    }).res,
    'a<br class="z">\r\nb',
    "06.01",
  );
});

test("07 - br with attribute, line break present - eol setting CRLF", () => {
  equal(
    det1('a<br class="z">\r\nb', {
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: false,
      convertEntities: true,
      eol: "crlf",
    }).res,
    'a<br class="z">\r\nb',
    "07.01",
  );
});

test("08 - br with attribute, line break present - eol setting CR", () => {
  equal(
    det1('a<br class="z">\r\nb', {
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: false,
      convertEntities: true,
      eol: "cr",
    }).res,
    'a<br class="z">\rb',
    "08.01",
  );
});

test("09 - br with attribute, line break present - eol setting LF", () => {
  equal(
    det1('a<br class="z">\r\nb', {
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: false,
      convertEntities: true,
      eol: "lf",
    }).res,
    'a<br class="z">\nb',
    "09.01",
  );
});

// --------------------------------------------------------

test("10 - only adds a slash, respects existing attrs", () => {
  ["\r\n", "\r", "\n"].forEach((eolType) => {
    mixer({
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: true,
      convertEntities: true,
    }).forEach((opt, n) => {
      equal(
        det(ok, not, n, `a<br class="z">${eolType}b`, opt).res,
        'a<br class="z"/>\nb',
        `${JSON.stringify(eolType, null, 4)} --- ${JSON.stringify(
          opt,
          null,
          0,
        )}`,
      );
    });
  });
});

test("11 - br with attribute, no line break, HTML", () => {
  mixer({
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: false,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'a<br class="z">b', opt).res,
      'a<br class="z">b',
      `${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("12 - br with attribute, no line break, XHTML", () => {
  mixer({
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'a<br class="z">b', opt).res,
      'a<br class="z"/>b',
      `${JSON.stringify(opt, null, 0)}`,
    );
  });
});

// 02. consistency in whitespace collapsing across different linebreak-processing settings
// -----------------------------------------------------------------------------

test("13 - multiple consecutive line breaks", () => {
  mixer({
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abcd\n\n\n\n\n\n\nefgh", opt).res,
      "abcd<br/>\n<br/>\nefgh",
      `${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("14 - multiple consecutive line breaks", () => {
  mixer({
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abcd\n\n\n\n\n\n\nefgh", opt).res,
      "abcd<br>\n<br>\nefgh",
      `${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("15 - multiple consecutive line breaks", () => {
  mixer({
    replaceLineBreaks: false,
    removeLineBreaks: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abcd\n\n\n\n\n\n\nefgh", opt).res,
      "abcd\n\nefgh",
      `${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("16 - multiple consecutive line breaks", () => {
  mixer({
    removeLineBreaks: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abcd\n\n\n\n\n\n\nefgh", opt).res,
      "abcd efgh",
      `${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test.run();
