import tap from "tap";
import { isRel } from "../dist/is-relative-uri.esm.js";

const BACKSLASH = "\u005C";

// 00. API bits
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${32}m${`api bits`}\u001b[${39}m`} - 1st arg wrong`,
  (t) => {
    t.throws(() => {
      isRel();
    }, /THROW_ID_01/gm);
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${32}m${`api bits`}\u001b[${39}m`} - 1st arg wrong`,
  (t) => {
    t.throws(() => {
      isRel(true);
    }, /THROW_ID_01/gm);
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${32}m${`api bits`}\u001b[${39}m`} - 1st arg wrong`,
  (t) => {
    t.throws(() => {
      isRel(1);
    }, /THROW_ID_01/gm);
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${32}m${`api bits`}\u001b[${39}m`} - 2nd arg wrong`,
  (t) => {
    t.throws(() => {
      isRel("", true);
    }, /THROW_ID_02/gm);
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${32}m${`api bits`}\u001b[${39}m`} - 2nd arg wrong`,
  (t) => {
    t.throws(() => {
      isRel("", 1);
    }, /THROW_ID_02/gm);
    t.end();
  }
);

// 01. correct values
// -----------------------------------------------------------------------------

tap.test(`06 - ${`\u001b[${33}m${`correct values`}\u001b[${39}m`}`, (t) => {
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
    "#fragment",
  ].forEach((val) => {
    t.ok(isRel(val).res, val);
  });
  t.end();
});

// Examples from:
// https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#URI_references
tap.test(
  `07 - ${`\u001b[${33}m${`correct values`}\u001b[${39}m`} Part II`,
  (t) => {
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
      "../../g", // -> "http://a/g"
    ].forEach((val) => {
      t.ok(isRel(val).res, val);
    });
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`correct values`}\u001b[${39}m`} - isolated cases from above`,
  (t) => {
    t.ok(isRel(`.`).res, "08");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`correct values`}\u001b[${39}m`} - isolated cases from above`,
  (t) => {
    t.ok(isRel(`..`).res, "09");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`correct values`}\u001b[${39}m`} - isolated cases from above`,
  (t) => {
    t.ok(isRel(`../..`).res, "10");
    t.end();
  }
);

// 02. incorrect values
// -----------------------------------------------------------------------------

tap.test(
  `11 - ${`\u001b[${33}m${`incorrect values`}\u001b[${39}m`} - starts with three or more slashes`,
  (t) => {
    t.notOk(isRel(`///example.com`).res, "11");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${33}m${`incorrect values`}\u001b[${39}m`} - two or more slashes anywhere in the middle`,
  (t) => {
    t.notOk(isRel(`path//resource.txt`).res, "12");
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${33}m${`incorrect values`}\u001b[${39}m`} - starts with more than two dots`,
  (t) => {
    t.notOk(isRel(`.../resource.txt`).res, "13");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${33}m${`incorrect values`}\u001b[${39}m`} - bad characters`,
  (t) => {
    [BACKSLASH, "%g", "<", ">", "[", "]", "{", "}", "|", "^"].forEach((val) => {
      t.notOk(isRel(`a${val}b`).res, val);
    });
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${33}m${`incorrect values`}\u001b[${39}m`} - ends with dot`,
  (t) => {
    t.notOk(isRel(`path/resource.`).res, "15");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${33}m${`incorrect values`}\u001b[${39}m`} - dot dot not-slash`,
  (t) => {
    t.notOk(isRel(`..a/g`).res, "16");
    t.end();
  }
);

// 03. hash
// -----------------------------------------------------------------------------

tap.test(
  `17 - ${`\u001b[${33}m${`incorrect values`}\u001b[${39}m`} - hash followed by slash`,
  (t) => {
    t.notOk(isRel(`abc/def#ghi/jkl`).res, "17");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${33}m${`incorrect values`}\u001b[${39}m`} - ends with hash`,
  (t) => {
    t.notOk(isRel(`abc/def#`).res, "18");
    t.end();
  }
);

// 04. opts.flagUpUrisWithSchemes
// -----------------------------------------------------------------------------

tap.test(
  `19 - ${`\u001b[${33}m${`incorrect values`}\u001b[${39}m`} - default`,
  (t) => {
    t.notOk(isRel(`mailto:John.Doe@example.com`).res, "19");
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${33}m${`incorrect values`}\u001b[${39}m`} - default`,
  (t) => {
    t.ok(
      isRel(`mailto:John.Doe@example.com`, {
        flagUpUrisWithSchemes: false,
      }).res,
      "20"
    );
    t.end();
  }
);
