const t = require("tap");
const isRel = require("../dist/is-relative-uri.cjs");

const BACKSLASH = "\u005C";

// 00. API bits
// -----------------------------------------------------------------------------

t.test(
  `00.01 - ${`\u001b[${32}m${`api bits`}\u001b[${39}m`} - 1st arg wrong`,
  t => {
    t.throws(() => {
      isRel();
    }, /THROW_ID_01/gm);
    t.end();
  }
);

t.test(
  `00.02 - ${`\u001b[${32}m${`api bits`}\u001b[${39}m`} - 1st arg wrong`,
  t => {
    t.throws(() => {
      isRel(true);
    }, /THROW_ID_01/gm);
    t.end();
  }
);

t.test(
  `00.03 - ${`\u001b[${32}m${`api bits`}\u001b[${39}m`} - 1st arg wrong`,
  t => {
    t.throws(() => {
      isRel(1);
    }, /THROW_ID_01/gm);
    t.end();
  }
);

t.test(
  `00.04 - ${`\u001b[${32}m${`api bits`}\u001b[${39}m`} - 2nd arg wrong`,
  t => {
    t.throws(() => {
      isRel("", true);
    }, /THROW_ID_02/gm);
    t.end();
  }
);

t.test(
  `00.05 - ${`\u001b[${32}m${`api bits`}\u001b[${39}m`} - 2nd arg wrong`,
  t => {
    t.throws(() => {
      isRel("", 1);
    }, /THROW_ID_02/gm);
    t.end();
  }
);

// 01. correct values
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${33}m${`correct values`}\u001b[${39}m`}`, t => {
  [
    "//example.com/path/resource.txt",
    "/path/resource.txt",
    "path/resource.txt",
    "path/resource.html",
    "path/resource.html#fragment",
    "path/resource.html?z=1",
    "/path/resource.txt",
    "/path/resource.html#fragment",
    "/path/resource.html?z=1",
    "../resource.txt",
    "./resource.txt",
    "resource.txt",
    "#fragment"
  ].forEach(val => {
    t.ok(isRel(val).res, val);
  });
  t.end();
});

// Examples from:
// https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#URI_references
t.test(
  `01.02 - ${`\u001b[${33}m${`correct values`}\u001b[${39}m`} Part II`,
  t => {
    [
      "g:h", // -> "g:h"
      "g", // -> "http://a/b/c/g"
      "./g", // -> "http://a/b/c/g"
      "g/", // -> "http://a/b/c/g/"
      "/g", // -> "http://a/g"
      "//g", // -> "http://g"
      "?y", // -> "http://a/b/c/d;p?y"
      "g?y", // -> "http://a/b/c/g?y"
      "#s", // -> "http://a/b/c/d;p?q#s"
      "g#s", // -> "http://a/b/c/g#s"
      "g?y#s", // -> "http://a/b/c/g?y#s"
      ";x", // -> "http://a/b/c/;x"
      "g;x", // -> "http://a/b/c/g;x"
      "g;x?y#s", // -> "http://a/b/c/g;x?y#s"
      "", // -> "http://a/b/c/d;p?q"
      ".", // -> "http://a/b/c/"
      "./", // -> "http://a/b/c/"
      "..", // -> "http://a/b/"
      "../", // -> "http://a/b/"
      "../g", // -> "http://a/b/g"
      "../..", // -> "http://a/"
      "../../", // -> "http://a/"
      "../../g" // -> "http://a/g"
    ].forEach(val => {
      t.ok(isRel(val).res, val);
    });
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${33}m${`correct values`}\u001b[${39}m`} - isolated cases from above`,
  t => {
    t.ok(isRel(`.`).res);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${33}m${`correct values`}\u001b[${39}m`} - isolated cases from above`,
  t => {
    t.ok(isRel(`..`).res);
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${33}m${`correct values`}\u001b[${39}m`} - isolated cases from above`,
  t => {
    t.ok(isRel(`../..`).res);
    t.end();
  }
);

// 02. incorrect values
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${33}m${`incorrect values`}\u001b[${39}m`} - starts with three or more slashes`,
  t => {
    t.notOk(isRel(`///example.com`).res);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${33}m${`incorrect values`}\u001b[${39}m`} - two or more slashes anywhere in the middle`,
  t => {
    t.notOk(isRel(`path//resource.txt`).res);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${33}m${`incorrect values`}\u001b[${39}m`} - starts with more than two dots`,
  t => {
    t.notOk(isRel(`.../resource.txt`).res);
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${33}m${`incorrect values`}\u001b[${39}m`} - bad characters`,
  t => {
    [BACKSLASH, "%g", "<", ">", "[", "]", "{", "}", "|", "^"].forEach(val => {
      t.notOk(isRel(`a${val}b`).res, val);
    });
    t.end();
  }
);

t.test(
  `02.05 - ${`\u001b[${33}m${`incorrect values`}\u001b[${39}m`} - ends with dot`,
  t => {
    t.notOk(isRel(`path/resource.`).res);
    t.end();
  }
);

t.test(
  `02.06 - ${`\u001b[${33}m${`incorrect values`}\u001b[${39}m`} - dot dot not-slash`,
  t => {
    t.notOk(isRel(`..a/g`).res);
    t.end();
  }
);

// 03. hash
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${33}m${`incorrect values`}\u001b[${39}m`} - hash followed by slash`,
  t => {
    t.notOk(isRel(`abc/def#ghi/jkl`).res);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${33}m${`incorrect values`}\u001b[${39}m`} - ends with hash`,
  t => {
    t.notOk(isRel(`abc/def#`).res);
    t.end();
  }
);
