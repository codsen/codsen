import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import { findUnsupportedIifeRegexpSyntax } from "../browserRegexpSyntax.js";

test("01 - reports regular expression syntax newer than the floor", () => {
  // esbuild lowers language syntax but leaves these literals untouched, so
  // each one is a parse error which disables the whole bundle at load
  equal(
    findUnsupportedIifeRegexpSyntax("var a = /(?<=x)y/;"),
    ["regular expression lookbehind (Chromium 62)"],
    "01.01",
  );
  equal(
    findUnsupportedIifeRegexpSyntax("var a = /(?<!x)y/;"),
    ["regular expression lookbehind (Chromium 62)"],
    "01.02",
  );
  equal(
    findUnsupportedIifeRegexpSyntax("var a = /(?<year>\\d{4})/;"),
    ["regular expression named capture group (Chromium 64)"],
    "01.03",
  );
  equal(
    findUnsupportedIifeRegexpSyntax("var a = /(?<n>x)\\k<n>/;"),
    [
      "regular expression named capture group (Chromium 64)",
      "regular expression named backreference (Chromium 64)",
    ],
    "01.04",
  );
  equal(
    findUnsupportedIifeRegexpSyntax("var a = /\\p{Letter}/u, b = /\\P{L}/u;"),
    ["regular expression Unicode property escape (Chromium 64)"],
    "01.05",
  );
  equal(
    findUnsupportedIifeRegexpSyntax("var a = /x.y/s;"),
    ["regular expression dotAll flag (Chromium 62)"],
    "01.06",
  );
  equal(
    findUnsupportedIifeRegexpSyntax("var a = /x/d;"),
    ["regular expression match indices flag (Chromium 90)"],
    "01.07",
  );
  equal(
    findUnsupportedIifeRegexpSyntax("var a = /[a]/v;"),
    ["regular expression unicodeSets flag (Chromium 112)"],
    "01.08",
  );
  throws(
    () => findUnsupportedIifeRegexpSyntax(null),
    /must be a string/,
    "01.09",
  );
});

test("02 - does not mistake data or division for a literal", () => {
  // the exact shape which defeated a substring-only scan: minified array
  // members whose contents read as a literal ending in an `s` flag
  equal(
    findUnsupportedIifeRegexpSyntax(
      'var t = ["</td","<html","</html","<head","<script","<style"];',
    ),
    [],
    "02.01",
  );
  equal(findUnsupportedIifeRegexpSyntax("var q = a/b/s;"), [], "02.02");
  equal(
    findUnsupportedIifeRegexpSyntax(
      'var a = /ab+c/gi, b = str.replace(/x/gu, "y");',
    ),
    [],
    "02.03",
  );
  equal(
    findUnsupportedIifeRegexpSyntax(`var t = \`x\${a/b/g}y\`;`),
    [],
    "02.04",
  );
  equal(
    findUnsupportedIifeRegexpSyntax(
      "// mentions /(?:x)/s in a comment\nvar a=1;",
    ),
    [],
    "02.05",
  );
  equal(
    findUnsupportedIifeRegexpSyntax("/* banner /x/s */ var a = 1;"),
    [],
    "02.06",
  );
  // a literal is still found after a keyword, and after an operator
  equal(
    findUnsupportedIifeRegexpSyntax("function f(){ return /x.y/s; }"),
    ["regular expression dotAll flag (Chromium 62)"],
    "02.07",
  );
});

test("03 - reads the four syntax classes from literals, not from data", () => {
  // the same four substrings which fail a build inside a literal are ordinary
  // text inside a string or a comment, and failing over those is failing over
  // nothing
  equal(findUnsupportedIifeRegexpSyntax('var a = "(?<=x)";'), [], "03.01");
  equal(findUnsupportedIifeRegexpSyntax("// (?<=x)\nvar a = 1;"), [], "03.02");
  equal(
    findUnsupportedIifeRegexpSyntax('var a = ["(?<name>a)"];'),
    [],
    "03.03",
  );
  equal(findUnsupportedIifeRegexpSyntax('var a = "\\\\p{L}";'), [], "03.04");
  equal(
    findUnsupportedIifeRegexpSyntax("var a = `\\\\k<n> in a template`;"),
    [],
    "03.05",
  );
  // the literal forms of the same four still report
  equal(
    findUnsupportedIifeRegexpSyntax("var a = /(?<=x)y/;"),
    ["regular expression lookbehind (Chromium 62)"],
    "03.06",
  );
  equal(
    findUnsupportedIifeRegexpSyntax('var a = "(?<=x)", b = /(?<=x)y/;'),
    ["regular expression lookbehind (Chromium 62)"],
    "03.07",
  );
});

test("04 - keeps scanning after a slash a hand scanner resolves wrongly", () => {
  // `if(a)/…/` is a literal in a position where `/` usually means division. A
  // scanner which guesses division walks on inside the literal, and the quote
  // in it then sends the scan hunting for a close that never comes, so nothing
  // later in the file is found.
  equal(
    findUnsupportedIifeRegexpSyntax(`if(a)/['"]/.test(b);var z=/x/s;`),
    ["regular expression dotAll flag (Chromium 62)"],
    "04.01",
  );
  equal(
    findUnsupportedIifeRegexpSyntax(`if(a)/['"]/.test(b);var z=/(?<=y)x/;`),
    ["regular expression lookbehind (Chromium 62)"],
    "04.02",
  );
  equal(findUnsupportedIifeRegexpSyntax(`if(a)/['"]/.test(b);`), [], "04.03");
  // flags are letters, but not every letter after a `/` is a flag: these are
  // property accesses on either side of a division
  equal(findUnsupportedIifeRegexpSyntax("x.in/y/split"), [], "04.04");
  equal(findUnsupportedIifeRegexpSyntax("x.of/y/soon"), [], "04.05");
});

test("05 - reads pattern and flags from a RegExp constructor call", () => {
  // `new RegExp()` behind a guard is the documented way to build a pattern the
  // floor cannot parse, so the argument is audited however the pattern is
  // written - a group in it is not a reason to stop looking
  equal(
    findUnsupportedIifeRegexpSyntax('var a = new RegExp("^(a|b)$", "s");'),
    ["regular expression dotAll flag (Chromium 62)"],
    "05.01",
  );
  equal(
    findUnsupportedIifeRegexpSyntax('var a = new RegExp("x.y", "s");'),
    ["regular expression dotAll flag (Chromium 62)"],
    "05.02",
  );
  equal(
    findUnsupportedIifeRegexpSyntax('var a = RegExp("(?<=x)y");'),
    ["regular expression lookbehind (Chromium 62)"],
    "05.03",
  );
  equal(
    findUnsupportedIifeRegexpSyntax('var a = new RegExp(`(?<n>x)`, "u");'),
    ["regular expression named capture group (Chromium 64)"],
    "05.04",
  );
  // a pattern or flag string assembled at run time cannot be audited, and
  // guessing at one would fail a build over nothing
  equal(
    findUnsupportedIifeRegexpSyntax("var a = new RegExp(pattern, flags);"),
    [],
    "05.05",
  );
  equal(
    findUnsupportedIifeRegexpSyntax('var a = new RegExp("x", flags);'),
    [],
    "05.06",
  );
});

test("06 - reports a bundle it cannot parse rather than scanning nothing", () => {
  equal(
    findUnsupportedIifeRegexpSyntax("function ( { var"),
    ["regular expressions unscannable, the bundle did not parse"],
    "06.01",
  );
  // a parse failure hides the rest of the file, so what it did find is still
  // reported alongside it
  equal(
    findUnsupportedIifeRegexpSyntax("var a = /x/s; function ( { var"),
    [
      "regular expressions unscannable, the bundle did not parse",
      "regular expression dotAll flag (Chromium 62)",
    ],
    "06.02",
  );
  equal(findUnsupportedIifeRegexpSyntax("var a = 1;"), [], "06.03");
});

test.run();
