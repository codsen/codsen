// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

const key = ["crlf", "cr", "lf"];

// 01. basic tests on opts.replaceLineBreaks
// -----------------------------------------------------------------------------

test("001 - minimal example - correct existing linebreaks", () => {
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
          `001.01 - ${`present ${key[idx2]}, requested ${key[idx1]} --- ${JSON.stringify(
            opt,
            null,
            0,
          )}`}`,
        );
      });
    });
  });
});

test("002 - minimal example - br", () => {
  mixer({
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a<br/>b", opt).res,
      "a<br/>b",
      `002.01 - ${`${JSON.stringify(opt, null, 0)}`}`,
    );
  });
});

test("003 - replace \\n line breaks with BR - useXHTML=on", () => {
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
        `003.01 - ${`EOL: ${key[i]} --- ${JSON.stringify(opt, null, 0)}`}`,
      );
    });
  });
});

test("004 - replace \\n line breaks with BR - useXHTML=off", () => {
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
        `004.01 - ${`${eolType} --- ${JSON.stringify(opt, null, 0)}`}`,
      );
    });
  });
});

test("005 - br with attribute, line break present", () => {
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
        `005.01 - ${`${JSON.stringify(eolType, null, 4)} --- ${JSON.stringify(
          opt,
          null,
          0,
        )}`}`,
      );
    });
  });
});

//                           1 x 4
// --------------------------------------------------------

test("006 - br with attribute, line break present - no eol setting", () => {
  equal(
    det1('a<br class="z">\r\nb', {
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: false,
      convertEntities: true,
    }).res,
    'a<br class="z">\r\nb',
    "006.01",
  );
});

test("007 - br with attribute, line break present - eol setting CRLF", () => {
  equal(
    det1('a<br class="z">\r\nb', {
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: false,
      convertEntities: true,
      eol: "crlf",
    }).res,
    'a<br class="z">\r\nb',
    "007.01",
  );
});

test("008 - br with attribute, line break present - eol setting CR", () => {
  equal(
    det1('a<br class="z">\r\nb', {
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: false,
      convertEntities: true,
      eol: "cr",
    }).res,
    'a<br class="z">\rb',
    "008.01",
  );
});

test("009 - br with attribute, line break present - eol setting LF", () => {
  equal(
    det1('a<br class="z">\r\nb', {
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: false,
      convertEntities: true,
      eol: "lf",
    }).res,
    'a<br class="z">\nb',
    "009.01",
  );
});

// --------------------------------------------------------

test("010 - only adds a slash, respects existing attrs", () => {
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
        `010.01 - ${`${JSON.stringify(eolType, null, 4)} --- ${JSON.stringify(
          opt,
          null,
          0,
        )}`}`,
      );
    });
  });
});

test("011 - br with attribute, no line break, HTML", () => {
  mixer({
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: false,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'a<br class="z">b', opt).res,
      'a<br class="z">b',
      `011.01 - ${`${JSON.stringify(opt, null, 0)}`}`,
    );
  });
});

test("012 - br with attribute, no line break, XHTML", () => {
  mixer({
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'a<br class="z">b', opt).res,
      'a<br class="z"/>b',
      `012.01 - ${`${JSON.stringify(opt, null, 0)}`}`,
    );
  });
});

// 02. consistency in whitespace collapsing across different linebreak-processing settings
// -----------------------------------------------------------------------------

test("013 - multiple consecutive line breaks", () => {
  mixer({
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abcd\n\n\n\n\n\n\nefgh", opt).res,
      "abcd<br/>\n<br/>\nefgh",
      `013.01 - ${`${JSON.stringify(opt, null, 0)}`}`,
    );
  });
});

test("014 - multiple consecutive line breaks", () => {
  mixer({
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abcd\n\n\n\n\n\n\nefgh", opt).res,
      "abcd<br>\n<br>\nefgh",
      `014.01 - ${`${JSON.stringify(opt, null, 0)}`}`,
    );
  });
});

test("015 - multiple consecutive line breaks", () => {
  mixer({
    replaceLineBreaks: false,
    removeLineBreaks: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abcd\n\n\n\n\n\n\nefgh", opt).res,
      "abcd\n\nefgh",
      `015.01 - ${`${JSON.stringify(opt, null, 0)}`}`,
    );
  });
});

test("016 - multiple consecutive line breaks", () => {
  mixer({
    removeLineBreaks: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abcd\n\n\n\n\n\n\nefgh", opt).res,
      "abcd efgh",
      `016.01 - ${`${JSON.stringify(opt, null, 0)}`}`,
    );
  });
});

test.run();
