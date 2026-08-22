// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { del, set } from "../dist/edit-package-json.esm.js";
import { deleter, setter } from "./util/util.js";

// -----------------------------------------------------------------------------
// Cases that used to come out wrong
//
// Each of these was found by running set() and del() against object-path over
// randomly generated JSON, and each is the smallest input that still shows the
// problem. They cluster around two things the character walk got wrong: which
// character an unquoted value owns, and where an array's index stands.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// what an unquoted value owns
//
// A quoted or bracketed value ends on its closing character, so that character
// belongs to it. A number, a boolean or null ends on whatever comes next
// instead - and taking that along ate the bracket closing the container. Only
// minified input shows it, because indented input has whitespace in between.
// -----------------------------------------------------------------------------

test("01 - set - a number as the last member keeps the closing brace", () => {
  setter(equal, '{"a":1}', '{"a":2}', "a", 2, "01");
});

test("02 - set - a boolean as the last member keeps the closing brace", () => {
  setter(equal, '{"a":"b","c":false}', '{"a":"b","c":true}', "c", true, "02");
});

test("03 - del - a number as the last member keeps the closing brace", () => {
  deleter(equal, '{"a":"b","c":1}', '{"a":"b"}', "c", "03");
});

// -----------------------------------------------------------------------------
// where the array index stands
// -----------------------------------------------------------------------------

test("04 - set - an element after an object element", () => {
  setter(equal, '[{"a":1},{"b":2}]', '[{"a":1},{"b":9}]', "1.b", 9, "04");
});

test("05 - set - an element after an array element", () => {
  setter(equal, "[[1],[2]]", "[[1],[9]]", "1.0", 9, "05");
});

// the index moved on one character later than the path was compared, so this
// used to replace from the "u" of "null" and leave the "n" behind
test("06 - set - an unquoted element is replaced from its first character", () => {
  setter(equal, "[{},null]", "[{},false]", "1", false, "06");
});

// nothing but whitespace follows the last element, and the comparison had no
// character left to catch up on, so this used to be a silent no-op
test("07 - set - the last element, unquoted, on its own line", () => {
  setter(equal, "[\n  0,\n  0\n]", "[\n  0,\n  9\n]", "1", 9, "07");
});

test("08 - del - the last element, unquoted, on its own line", () => {
  deleter(equal, "[\n  0,\n  0\n]", "[\n  0\n]", "1", "08");
});

test("09 - del - the first element of a top-level array", () => {
  // nothing non-whitespace sits to the left of it, which used to leave the
  // range start null and throw inside ranges-apply
  deleter(equal, "[[],[]]", "[[]]", "0", "09");
});

test("10 - del - an element that is an object", () => {
  deleter(
    equal,
    '[\n  false,\n  {\n    "x": true\n  }\n]',
    "[\n  false\n]",
    "1",
    "10",
  );
});

// -----------------------------------------------------------------------------
// the line break that made up for a value that no longer spans lines
// -----------------------------------------------------------------------------

// it went in ahead of the comma, which is where the break that follows already
// was, so the comma ended up stranded on a line of its own
test("11 - set - a multi-line value replaced by a short one", () => {
  setter(
    equal,
    '{\n  "a": [\n    "x"\n  ],\n  "b": 1\n}',
    '{\n  "a": "zz",\n  "b": 1\n}',
    "a",
    "zz",
    "11",
  );
});

test("12 - set - the same, as the last member", () => {
  setter(
    equal,
    '{\n  "a": [\n    "x"\n  ]\n}',
    '{\n  "a": "zz"\n}',
    "a",
    "zz",
    "12",
  );
});

// -----------------------------------------------------------------------------
// object-path spells array indexes canonically
// -----------------------------------------------------------------------------

test("13 - set - a leading zero addresses a key, not a slot", () => {
  setter(equal, '{"a":"b"}', '{"a":"b","c":{"01":"d"}}', "c.01", "d", "13");
});

test("14 - set - a canonical integer addresses a slot", () => {
  setter(equal, '{"a":"b"}', '{"a":"b","c":["d"]}', "c.0", "d", "14");
});

test.run();
