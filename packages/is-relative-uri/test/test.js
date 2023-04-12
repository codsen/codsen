import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isRel } from "../dist/is-relative-uri.esm.js";

const BACKSLASH = "\u005C";

// 00. API bits
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${32}m${"api bits"}\u001b[${39}m`} - 1st arg wrong`, () => {
  throws(
    () => {
      isRel();
    },
    /THROW_ID_01/gm,
    "01.01"
  );
});

test(`02 - ${`\u001b[${32}m${"api bits"}\u001b[${39}m`} - 1st arg wrong`, () => {
  throws(
    () => {
      isRel(true);
    },
    /THROW_ID_01/gm,
    "02.01"
  );
});

test(`03 - ${`\u001b[${32}m${"api bits"}\u001b[${39}m`} - 1st arg wrong`, () => {
  throws(
    () => {
      isRel(1);
    },
    /THROW_ID_01/gm,
    "03.01"
  );
});

test(`04 - ${`\u001b[${32}m${"api bits"}\u001b[${39}m`} - 2nd arg wrong`, () => {
  throws(
    () => {
      isRel("", true);
    },
    /THROW_ID_02/gm,
    "04.01"
  );
});

test(`05 - ${`\u001b[${32}m${"api bits"}\u001b[${39}m`} - 2nd arg wrong`, () => {
  throws(
    () => {
      isRel("", 1);
    },
    /THROW_ID_02/gm,
    "05.01"
  );
});

// 01. correct values
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${33}m${"correct values"}\u001b[${39}m`}`, () => {
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
    ok(isRel(val).res, val);
  });
});

// Examples from:
// https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#URI_references
test(`07 - ${`\u001b[${33}m${"correct values"}\u001b[${39}m`} Part II`, () => {
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
    ok(isRel(val).res, val);
  });
});

test(`08 - ${`\u001b[${33}m${"correct values"}\u001b[${39}m`} - isolated cases from above`, () => {
  ok(isRel(".").res, "08.01");
});

test(`09 - ${`\u001b[${33}m${"correct values"}\u001b[${39}m`} - isolated cases from above`, () => {
  ok(isRel("..").res, "09.01");
});

test(`10 - ${`\u001b[${33}m${"correct values"}\u001b[${39}m`} - isolated cases from above`, () => {
  ok(isRel("../..").res, "10.01");
});

// 02. incorrect values
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${33}m${"incorrect values"}\u001b[${39}m`} - starts with three or more slashes`, () => {
  not.ok(isRel("///example.com").res, "11.01");
});

test(`12 - ${`\u001b[${33}m${"incorrect values"}\u001b[${39}m`} - two or more slashes anywhere in the middle`, () => {
  not.ok(isRel("path//resource.txt").res, "12.01");
});

test(`13 - ${`\u001b[${33}m${"incorrect values"}\u001b[${39}m`} - starts with more than two dots`, () => {
  not.ok(isRel(".../resource.txt").res, "13.01");
});

test(`14 - ${`\u001b[${33}m${"incorrect values"}\u001b[${39}m`} - bad characters`, () => {
  [BACKSLASH, "%g", "<", ">", "[", "]", "{", "}", "|", "^"].forEach((val) => {
    not.ok(isRel(`a${val}b`).res, val);
  });
});

test(`15 - ${`\u001b[${33}m${"incorrect values"}\u001b[${39}m`} - ends with dot`, () => {
  not.ok(isRel("path/resource.").res, "15.01");
});

test(`16 - ${`\u001b[${33}m${"incorrect values"}\u001b[${39}m`} - dot dot not-slash`, () => {
  not.ok(isRel("..a/g").res, "16.01");
});

// 03. hash
// -----------------------------------------------------------------------------

test(`17 - ${`\u001b[${33}m${"incorrect values"}\u001b[${39}m`} - hash followed by slash`, () => {
  not.ok(isRel("abc/def#ghi/jkl").res, "17.01");
});

test(`18 - ${`\u001b[${33}m${"incorrect values"}\u001b[${39}m`} - ends with hash`, () => {
  not.ok(isRel("abc/def#").res, "18.01");
});

// 04. opts.flagUpUrisWithSchemes
// -----------------------------------------------------------------------------

test(`19 - ${`\u001b[${33}m${"incorrect values"}\u001b[${39}m`} - default`, () => {
  not.ok(isRel("mailto:John.Doe@example.com").res, "19.01");
});

test(`20 - ${`\u001b[${33}m${"incorrect values"}\u001b[${39}m`} - default`, () => {
  ok(
    isRel("mailto:John.Doe@example.com", {
      flagUpUrisWithSchemes: false,
    }).res,
    "20.01"
  );
});

test.run();
