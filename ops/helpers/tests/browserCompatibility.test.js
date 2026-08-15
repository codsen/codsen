import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import {
  findUnsupportedIifeApis,
  findUnsupportedIifeRegexpSyntax,
  IIFE_API_SMOKES,
  IIFE_BROWSER_POLICY,
  iifeGlobalName,
} from "../browserCompatibility.js";

test("01 - declares one exact browser floor", () => {
  equal(
    IIFE_BROWSER_POLICY,
    {
      family: "Chromium",
      minimumMajor: 58,
      esbuildTarget: "chrome58",
      snapshotRevision: "454475",
      snapshotVersion: "58.0.3029.0",
      snapshotArchiveSha256:
        "c43892cbcf8d9d5402c3168aa6d14877f13597a6ed966b74f7837ac4031cadf4",
      snapshotArchiveUrl:
        "https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/454475/chrome-linux.zip",
    },
    "01.01",
  );
  equal(Object.isFrozen(IIFE_BROWSER_POLICY), true, "01.02");
});

test("02 - derives stable IIFE globals from package directories", () => {
  equal(iifeGlobalName("codsen-utils"), "codsenUtils", "02.01");
  equal(
    iifeGlobalName("array-group-str-omit-num-char"),
    "arrayGroupStrOmitNumChar",
    "02.02",
  );
  equal(iifeGlobalName("detergent"), "detergent", "02.03");
  equal(iifeGlobalName("Release-Tool"), "releaseTool", "02.04");
});

test("03 - rejects directory names outside the browser contract", () => {
  throws(() => iifeGlobalName("@scope/pkg"), /Invalid IIFE/, "03.01");
  throws(() => iifeGlobalName("snake_case"), /Invalid IIFE/, "03.02");
  throws(() => iifeGlobalName("two--hyphens"), /Invalid IIFE/, "03.03");
  throws(() => iifeGlobalName(), /Invalid IIFE/, "03.04");
  throws(() => iifeGlobalName("1-package"), /Invalid IIFE/, "03.05");
});

test("04 - reports APIs newer than the declared floor", () => {
  equal(
    findUnsupportedIifeApis(
      "Object.hasOwn(value, key); list.flatMap(fn); text.trimEnd();",
    ),
    ["Array.prototype.flatMap", "Object.hasOwn", "String.prototype.trimEnd"],
    "04.01",
  );
  equal(
    findUnsupportedIifeApis(
      "Object.prototype.hasOwnProperty.call(value, key); text.replace(/\\s+$/u, '');",
    ),
    [],
    "04.02",
  );
  equal(
    findUnsupportedIifeApis(
      'Promise.resolve().finally(done); new AbortController(); new AggregateError([]); BigInt(1); globalThis.value; new Intl.PluralRules(); Object[ "hasOwn" ](value, key);',
    ),
    [
      "AbortController",
      "AggregateError",
      "BigInt",
      "Object.hasOwn",
      "Promise.prototype.finally",
      "newer Intl constructors",
      "globalThis",
    ],
    "04.03",
  );
  equal(
    findUnsupportedIifeApis(
      'var root = typeof globalThis !== "undefined" ? globalThis : self; if (typeof globalThis === "object") return globalThis;',
    ),
    [],
    "04.04",
  );
  throws(() => findUnsupportedIifeApis(null), /must be a string/, "04.05");
});

test("05 - keeps browser smoke functions self-contained and serializable", () => {
  equal(
    Object.keys(IIFE_API_SMOKES),
    [
      "array-group-str-omit-num-char",
      "ast-deep-contains",
      "codsen-utils",
      "detergent",
      "email-comb",
      "generate-atomic-css",
      "is-language-code",
      "string-convert-indexes",
      "string-strip-html",
      "test-mixer",
    ],
    "05.01",
  );
  equal(
    Object.values(IIFE_API_SMOKES).every(
      (smoke) =>
        typeof Function(`return (${smoke.toString()});`)() === "function",
    ),
    true,
    "05.02",
  );
  equal(Object.isFrozen(IIFE_API_SMOKES), true, "05.03");
});

test("06 - reports regular expression syntax newer than the floor", () => {
  // esbuild lowers language syntax but leaves these literals untouched, so
  // each one is a parse error which disables the whole bundle at load
  equal(
    findUnsupportedIifeRegexpSyntax("var a = /(?<=x)y/;"),
    ["regular expression lookbehind (Chromium 62)"],
    "06.01",
  );
  equal(
    findUnsupportedIifeRegexpSyntax("var a = /(?<!x)y/;"),
    ["regular expression lookbehind (Chromium 62)"],
    "06.02",
  );
  equal(
    findUnsupportedIifeRegexpSyntax("var a = /(?<year>\\d{4})/;"),
    ["regular expression named capture group (Chromium 64)"],
    "06.03",
  );
  equal(
    findUnsupportedIifeRegexpSyntax("var a = /(?<n>x)\\k<n>/;"),
    [
      "regular expression named capture group (Chromium 64)",
      "regular expression named backreference (Chromium 64)",
    ],
    "06.04",
  );
  equal(
    findUnsupportedIifeRegexpSyntax("var a = /\\p{Letter}/u, b = /\\P{L}/u;"),
    ["regular expression Unicode property escape (Chromium 64)"],
    "06.05",
  );
  equal(
    findUnsupportedIifeRegexpSyntax("var a = /x.y/s;"),
    ["regular expression dotAll flag (Chromium 62)"],
    "06.06",
  );
  equal(
    findUnsupportedIifeRegexpSyntax("var a = /x/d;"),
    ["regular expression match indices flag (Chromium 90)"],
    "06.07",
  );
  equal(
    findUnsupportedIifeRegexpSyntax("var a = /[a]/v;"),
    ["regular expression unicodeSets flag (Chromium 112)"],
    "06.08",
  );
  equal(
    findUnsupportedIifeRegexpSyntax('var a = new RegExp("x.y", "s");'),
    ["regular expression dotAll flag (Chromium 62)"],
    "06.09",
  );
  throws(
    () => findUnsupportedIifeRegexpSyntax(null),
    /must be a string/,
    "06.10",
  );
});

test("07 - does not mistake data or division for a literal", () => {
  // the exact shape which defeated a substring-only scan: minified array
  // members whose contents read as a literal ending in an `s` flag
  equal(
    findUnsupportedIifeRegexpSyntax(
      'var t = ["</td","<html","</html","<head","<script","<style"];',
    ),
    [],
    "07.01",
  );
  equal(findUnsupportedIifeRegexpSyntax("var q = a/b/s;"), [], "07.02");
  equal(
    findUnsupportedIifeRegexpSyntax(
      'var a = /ab+c/gi, b = str.replace(/x/gu, "y");',
    ),
    [],
    "07.03",
  );
  equal(
    findUnsupportedIifeRegexpSyntax(`var t = \`x\${a/b/g}y\`;`),
    [],
    "07.04",
  );
  equal(
    findUnsupportedIifeRegexpSyntax(
      "// mentions /(?:x)/s in a comment\nvar a=1;",
    ),
    [],
    "07.05",
  );
  equal(
    findUnsupportedIifeRegexpSyntax("/* banner /x/s */ var a = 1;"),
    [],
    "07.06",
  );
  // a literal is still found after a keyword, and after an operator
  equal(
    findUnsupportedIifeRegexpSyntax("function f(){ return /x.y/s; }"),
    ["regular expression dotAll flag (Chromium 62)"],
    "07.07",
  );
});

test.run();
