// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { isRel } from "../dist/is-relative-uri.esm.js";

const BACKSLASH = "\u005C";

// 00. API bits
// -----------------------------------------------------------------------------

test(`01 - api bits - 1st arg wrong`, () => {
  throws(
    () => {
      isRel();
    },
    /THROW_ID_01/gm,
    "01.01",
  );
});

test(`02 - api bits - 1st arg wrong`, () => {
  throws(
    () => {
      isRel(true);
    },
    /THROW_ID_01/gm,
    "02.01",
  );
});

test(`03 - api bits - 1st arg wrong`, () => {
  throws(
    () => {
      isRel(1);
    },
    /THROW_ID_01/gm,
    "03.01",
  );
});

test(`04 - api bits - 2nd arg wrong`, () => {
  throws(
    () => {
      isRel("", true);
    },
    /THROW_ID_02/gm,
    "04.01",
  );
});

test(`05 - api bits - 2nd arg wrong`, () => {
  throws(
    () => {
      isRel("", 1);
    },
    /THROW_ID_02/gm,
    "05.01",
  );
});

// 01. correct values
// -----------------------------------------------------------------------------

test(`06 - correct values`, () => {
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
test(`07 - correct values Part II`, () => {
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

test(`08 - correct values - isolated cases from above`, () => {
  ok(isRel(".").res, "08.01");
});

test(`09 - correct values - isolated cases from above`, () => {
  ok(isRel("..").res, "09.01");
});

test(`10 - correct values - isolated cases from above`, () => {
  ok(isRel("../..").res, "10.01");
});

// 02. incorrect values
// -----------------------------------------------------------------------------

test(`11 - incorrect values - starts with three or more slashes`, () => {
  not.ok(isRel("///example.com").res, "11.01");
});

test(`12 - incorrect values - two or more slashes anywhere in the middle`, () => {
  not.ok(isRel("path//resource.txt").res, "12.01");
});

test(`13 - incorrect values - starts with more than two dots`, () => {
  not.ok(isRel(".../resource.txt").res, "13.01");
});

test(`14 - incorrect values - bad characters`, () => {
  [BACKSLASH, "%g", "<", ">", "[", "]", "{", "}", "|", "^"].forEach((val) => {
    not.ok(isRel(`a${val}b`).res, val);
  });
});

test(`15 - incorrect values - ends with dot`, () => {
  not.ok(isRel("path/resource.").res, "15.01");
});

test(`16 - incorrect values - dot dot not-slash`, () => {
  not.ok(isRel("..a/g").res, "16.01");
});

// 03. hash
// -----------------------------------------------------------------------------

test(`17 - incorrect values - hash followed by slash`, () => {
  not.ok(isRel("abc/def#ghi/jkl").res, "17.01");
});

test(`18 - incorrect values - ends with hash`, () => {
  not.ok(isRel("abc/def#").res, "18.01");
});

// 04. opts.flagUpUrisWithSchemes
// -----------------------------------------------------------------------------

test(`19 - incorrect values - default`, () => {
  not.ok(isRel("mailto:John.Doe@example.com").res, "19.01");
});

test(`20 - incorrect values - default`, () => {
  ok(
    isRel("mailto:John.Doe@example.com", {
      flagUpUrisWithSchemes: false,
    }).res,
    "20.01",
  );
});

test.run();
