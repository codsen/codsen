// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { set } from "../dist/edit-package-json.esm.js";
import { setter } from "./util/util.js";

// -----------------------------------------------------------------------------
// set() adding keys that were not there
//
// The point of this package is that the formatting survives, so every case
// below is as much about the whitespace in the result as about the value.
// -----------------------------------------------------------------------------

const pkg = `{
  "name": "demo",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc"
  }
}`;

// -----------------------------------------------------------------------------
// the indentation is read off the input, never imposed
// -----------------------------------------------------------------------------

test("01 - new key in the root, two-space input", () => {
  let result = `{
  "name": "demo",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc"
  },
  "license": "MIT"
}`;
  setter(equal, pkg, result, "license", "MIT", "01");
});

test("02 - new key in a nested object", () => {
  let result = `{
  "name": "demo",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc",
    "test": "uvu"
  }
}`;
  setter(equal, pkg, result, "scripts.test", "uvu", "02");
});

test("03 - tab-indented input keeps tabs", () => {
  setter(
    equal,
    '{\n\t"a": "b"\n}',
    '{\n\t"a": "b",\n\t"c": "d"\n}',
    "c",
    "d",
    "03",
  );
});

test("04 - four-space input keeps four spaces", () => {
  setter(
    equal,
    '{\n    "a": "b"\n}',
    '{\n    "a": "b",\n    "c": "d"\n}',
    "c",
    "d",
    "04",
  );
});

test("05 - minified input stays minified", () => {
  setter(equal, '{"a":"b"}', '{"a":"b","c":"d"}', "c", "d", "05");
});

test("06 - the gap after the colon is copied from the input", () => {
  setter(equal, '{"a": "b"}', '{"a": "b","c": "d"}', "c", "d", "06");
});

// what separates members is whatever already separates them - here the source
// puts a space in front of its member, so the new one gets one too
test("07 - the gap in front of a member is copied from the input", () => {
  setter(equal, '{ "a": "b" }', '{ "a": "b", "c": "d" }', "c", "d", "07");
});

// -----------------------------------------------------------------------------
// containers that have to be created
// -----------------------------------------------------------------------------

test("08 - an empty object gets opened up", () => {
  setter(
    equal,
    '{\n  "scripts": {}\n}',
    '{\n  "scripts": {\n    "test": "uvu"\n  }\n}',
    "scripts.test",
    "uvu",
    "08",
  );
});

test("09 - the whole missing chain gets built", () => {
  let result = `{
  "name": "demo",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "uvu": "^0.5.0"
  }
}`;
  setter(equal, pkg, result, "dependencies.uvu", "^0.5.0", "09");
});

test("10 - a whole chain, several levels deep", () => {
  setter(
    equal,
    '{\n  "a": "b"\n}',
    '{\n  "a": "b",\n  "c": {\n    "d": {\n      "e": "f"\n    }\n  }\n}',
    "c.d.e",
    "f",
    "10",
  );
});

// an all-digits segment asks for an array, anything else asks for an object -
// the same call object-path makes
test("11 - an all-digits segment creates an array", () => {
  setter(
    equal,
    '{\n  "a": "b"\n}',
    '{\n  "a": "b",\n  "files": [\n    "dist"\n  ]\n}',
    "files.0",
    "dist",
    "11",
  );
});

test("12 - a segment that only looks numeric creates an object", () => {
  setter(equal, '{"a":"b"}', '{"a":"b","c":{"01":"d"}}', "c.01", "d", "12");
});

// -----------------------------------------------------------------------------
// arrays
// -----------------------------------------------------------------------------

test("13 - appending to an array", () => {
  setter(
    equal,
    '{\n  "files": [\n    "dist"\n  ]\n}',
    '{\n  "files": [\n    "dist",\n    "types"\n  ]\n}',
    "files.1",
    "types",
    "13",
  );
});

test("14 - appending to an empty array", () => {
  setter(equal, '{"a":[]}', '{"a":["b"]}', "a.0", "b", "14");
});

test("15 - a key added to an object inside an array", () => {
  setter(
    equal,
    '{\n  "a": [\n    {\n      "b": 1\n    }\n  ]\n}',
    '{\n  "a": [\n    {\n      "b": 1,\n      "c": 2\n    }\n  ]\n}',
    "a.0.c",
    2,
    "15",
  );
});

// -----------------------------------------------------------------------------
// values other than strings
// -----------------------------------------------------------------------------

test("16 - number", () => {
  setter(equal, '{"a":"b"}', '{"a":"b","c":42}', "c", 42, "16");
});

test("17 - zero", () => {
  setter(equal, '{"a":"b"}', '{"a":"b","c":0}', "c", 0, "17");
});

// -----------------------------------------------------------------------------
// nothing to add the key to
//
// object-path throws on all of these. Without parsing there is nothing to throw
// about with any confidence, so the input comes back as it went in.
// -----------------------------------------------------------------------------

test("18 - a path under a string is left alone", () => {
  is(set('{"a":"b"}', "a.c", "x"), '{"a":"b"}', "18.01");
});

test("19 - a path under a number is left alone", () => {
  is(set('{"a":1}', "a.c", "x"), '{"a":1}', "19.01");
});

test("20 - a non-index segment on an array is left alone", () => {
  is(set('{"a":[]}', "a.x", "y"), '{"a":[]}', "20.01");
});

test("21 - an empty path segment is left alone", () => {
  is(set('{"a":"b"}', "c..d", "x"), '{"a":"b"}', "21.01");
});

// -----------------------------------------------------------------------------
// setting a key that IS there still just replaces it
// -----------------------------------------------------------------------------

test("22 - an existing key is replaced, not duplicated", () => {
  let result = `{
  "name": "demo",
  "version": "2.0.0",
  "scripts": {
    "build": "tsc"
  }
}`;
  setter(equal, pkg, result, "version", "2.0.0", "22");
});

test("23 - an existing nested key is replaced, not duplicated", () => {
  let result = `{
  "name": "demo",
  "version": "1.0.0",
  "scripts": {
    "build": "rollup"
  }
}`;
  setter(equal, pkg, result, "scripts.build", "rollup", "23");
});

test.run();
