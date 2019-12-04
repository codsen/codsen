const t = require("tap");
const detergent = require("../dist/detergent.cjs");
const det1 = detergent.det;
const {
  det,
  mixer //, allCombinations
} = require("../t-util/util");
const key = ["crlf", "cr", "lf"];

// 01. basic tests on opts.replaceLineBreaks
// -----------------------------------------------------------------------------

t.test(`01.01 - minimal example - correct existing linebreaks`, t => {
  ["\r\n", "\r", "\n"].forEach((requestedEolType, idx1) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx2) => {
      mixer({
        replaceLineBreaks: 1,
        removeLineBreaks: 0,
        useXHTML: 1,
        convertEntities: 1,
        eol: key[idx1]
      }).forEach((opt, n) => {
        t.equal(
          det(t, n, `a${presentEolType}b`, opt).res,
          `a<br/>${requestedEolType}b`,
          `present ${key[idx2]}, requested ${key[idx1]} --- ${JSON.stringify(
            opt,
            null,
            0
          )}`
        );
      });
    });
  });
  t.end();
});

t.test(`01.02 - minimal example - br`, t => {
  mixer({
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 1,
    convertEntities: 1
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `a<br/>b`, opt).res,
      "a<br/>b",
      `${JSON.stringify(opt, null, 0)}`
    );
  });
  t.end();
});

t.test(`01.03 - replace \\n line breaks with BR - useXHTML=on`, t => {
  ["\r\n", "\r", "\n"].forEach((eolType, i) => {
    mixer({
      replaceLineBreaks: 1,
      removeLineBreaks: 0,
      useXHTML: 1,
      convertEntities: 1
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          `${eolType}${eolType}${eolType}tralala${eolType}tralala2${eolType}${eolType}tralala3${eolType}${eolType}${eolType}tralala4${eolType}${eolType}${eolType}`,
          opt
        ).res,
        `tralala<br/>\ntralala2<br/>\n<br/>\ntralala3<br/>\n<br/>\ntralala4`,
        `EOL: ${key[i]} --- ${JSON.stringify(opt, null, 0)}`
      );
    });
  });
  t.end();
});

t.test(`01.04 - replace \\n line breaks with BR - useXHTML=off`, t => {
  ["\r\n", "\r", "\n"].forEach(eolType => {
    mixer({
      replaceLineBreaks: 1,
      removeLineBreaks: 0,
      useXHTML: 0,
      convertEntities: 1
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          `${eolType}${eolType}tralala${eolType}tralala2${eolType}${eolType}tralala3${eolType}${eolType}${eolType}tralala4${eolType}${eolType}${eolType}${eolType}`,
          opt
        ).res,
        `tralala<br>\ntralala2<br>\n<br>\ntralala3<br>\n<br>\ntralala4`,
        `${eolType} --- ${JSON.stringify(opt, null, 0)}`
      );
    });
  });
  t.end();
});

t.test(`01.05 - br with attribute, line break present`, t => {
  ["\r\n", "\r", "\n"].forEach(eolType => {
    mixer({
      replaceLineBreaks: 1,
      removeLineBreaks: 0,
      useXHTML: 0,
      convertEntities: 1
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a<br class="z">${eolType}b`, opt).res,
        `a<br class="z">\nb`,
        `${JSON.stringify(eolType, null, 4)} --- ${JSON.stringify(
          opt,
          null,
          0
        )}`
      );
    });
  });
  t.equal(
    det1(`a<br class="z">\r\nb`, {
      replaceLineBreaks: 1,
      removeLineBreaks: 0,
      useXHTML: 0,
      convertEntities: 1
    }).res,
    `a<br class="z">\nb`
  );
  t.end();
});

t.test(`01.06 - only adds a slash, respects existing attrs`, t => {
  ["\r\n", "\r", "\n"].forEach(eolType => {
    mixer({
      replaceLineBreaks: 1,
      removeLineBreaks: 0,
      useXHTML: 1,
      convertEntities: 1
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a<br class="z">${eolType}b`, opt).res,
        `a<br class="z"/>\nb`,
        `${JSON.stringify(eolType, null, 4)} --- ${JSON.stringify(
          opt,
          null,
          0
        )}`
      );
    });
  });
  t.end();
});

t.test(`01.07 - br with attribute, no line break, HTML`, t => {
  mixer({
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 0,
    convertEntities: 1
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `a<br class="z">b`, opt).res,
      `a<br class="z">b`,
      `${JSON.stringify(opt, null, 0)}`
    );
  });
  t.end();
});

t.test(`01.08 - br with attribute, no line break, XHTML`, t => {
  mixer({
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 1,
    convertEntities: 1
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `a<br class="z">b`, opt).res,
      `a<br class="z"/>b`,
      `${JSON.stringify(opt, null, 0)}`
    );
  });
  t.end();
});

// 02. consistency in whitespace collapsing across different linebreak-processing settings
// -----------------------------------------------------------------------------

t.test(`02.01 - multiple consecutive line breaks`, t => {
  mixer({
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 1
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `abcd\n\n\n\n\n\n\nefgh`, opt).res,
      `abcd<br/>\n<br/>\nefgh`,
      `${JSON.stringify(opt, null, 0)}`
    );
  });
  t.end();
});

t.test(`02.02 - multiple consecutive line breaks`, t => {
  mixer({
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 0
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `abcd\n\n\n\n\n\n\nefgh`, opt).res,
      `abcd<br>\n<br>\nefgh`,
      `${JSON.stringify(opt, null, 0)}`
    );
  });
  t.end();
});

t.test(`02.03 - multiple consecutive line breaks`, t => {
  mixer({
    replaceLineBreaks: 0,
    removeLineBreaks: 0
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `abcd\n\n\n\n\n\n\nefgh`, opt).res,
      `abcd\n\nefgh`,
      `${JSON.stringify(opt, null, 0)}`
    );
  });
  t.end();
});

t.test(`02.04 - multiple consecutive line breaks`, t => {
  mixer({
    removeLineBreaks: 1
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `abcd\n\n\n\n\n\n\nefgh`, opt).res,
      `abcd efgh`,
      `${JSON.stringify(opt, null, 0)}`
    );
  });
  t.end();
});
