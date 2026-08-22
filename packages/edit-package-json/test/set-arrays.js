// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { set } from "../dist/edit-package-json.esm.js";
import { setter } from "./util/util.js";

const testObj = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;

// -----------------------------------------------------------------------------
// 06. set - on arrays, existing path
// -----------------------------------------------------------------------------

test(`01 - set - ${`\u001b[${36}m${"existing path"}\u001b[${39}m`} - nested arrays 1`, () => {
  let input = "[[]]";
  let result = "[true]";
  setter(equal, input, result, "0", true, "06.01");
});

test(`02 - set - ${`\u001b[${36}m${"existing path"}\u001b[${39}m`} - nested arrays 1`, () => {
  let input = "[{}]";
  let result = "[true]";
  setter(equal, input, result, "0", true, "06.02");
});

test(`03 - set - ${`\u001b[${36}m${"existing path"}\u001b[${39}m`} - nested arrays 1`, () => {
  let input = "[false]";
  let result = "[true]";
  setter(equal, input, result, "0", true, "06.03");
});

test(`04 - set - ${`\u001b[${36}m${"existing path"}\u001b[${39}m`} - nested arrays 1`, () => {
  let input = '["z"]';
  let result = "[true]";
  setter(equal, input, result, "0", true, "06.04");
});

// -----------------------------------------------------------------------------
// 06.05+ set - on arrays, new path
// -----------------------------------------------------------------------------

test(`05 - set - ${`\u001b[${36}m${"new path"}\u001b[${39}m`} - nested arrays 2`, () => {
  let input = "[[]]";
  let result = "[[true]]";
  setter(equal, input, result, "0.0", true, "06.05");
});

// object-path puts a "0" key on the object that is already there rather than
// swapping it for an array, so this is NOT [[true]]
test(`06 - set - ${`\u001b[${36}m${"new path"}\u001b[${39}m`} - nested arrays 2`, () => {
  let input = "[{}]";
  let result = '[{"0":true}]';
  setter(equal, input, result, "0.0", true, "06.06");
});

// object-path throws on these two - there is nothing to hang a key off a
// boolean or a string. Without parsing there is nothing sensible to do either,
// so the string comes back as it went in
test(`07 - set - ${`\u001b[${36}m${"new path"}\u001b[${39}m`} - under a boolean`, () => {
  is(set("[false]", "0.0", true), "[false]", "06.07.01");
});

test(`08 - set - ${`\u001b[${36}m${"new path"}\u001b[${39}m`} - under a string`, () => {
  is(set('["z"]', "0.0", true), '["z"]', "06.08.01");
});

test(`09 - set - ${`\u001b[${36}m${"new path"}\u001b[${39}m`} - append past the end`, () => {
  setter(equal, '{"a":[1,2]}', '{"a":[1,2,3]}', "a.2", 3, "06.09");
});

// a gap gets filled with nulls, the same way object-path leaves holes that
// serialise as null
test(`10 - set - ${`\u001b[${36}m${"new path"}\u001b[${39}m`} - past the end, with a gap`, () => {
  setter(
    equal,
    '{"a":[1,2]}',
    '{"a":[1,2,null,null,null,9]}',
    "a.5",
    9,
    "06.10",
  );
});

test(`11 - set - ${`\u001b[${36}m${"new path"}\u001b[${39}m`} - into an empty root array`, () => {
  setter(equal, "[]", '["foo"]', "0", "foo", "06.11");
});

// -----------------------------------------------------------------------------
// minified json
// -----------------------------------------------------------------------------

test("12 - minified - new key keeps the input minified", () => {
  setter(equal, '{"a":"b"}', '{"a":"b","c":"d"}', "c", "d", "06.12");
});

test("13 - minified - new array element", () => {
  setter(equal, '{"a":["b"]}', '{"a":["b","c"]}', "a.1", "c", "06.13");
});

test("14 - minified - new nested path", () => {
  setter(
    equal,
    '{"a":"b"}',
    '{"a":"b","c":{"d":{"e":"f"}}}',
    "c.d.e",
    "f",
    "06.14",
  );
});

// -----------------------------------------------------------------------------
// Create keys
// -----------------------------------------------------------------------------

test(`15 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set value under array`, () => {
  // an all-digits segment under a key that does not exist yet makes an array
  let res = set("{}", "b.0", "c");
  equal(res, '{"b":["c"]}', "15.01");
  res = set(res, "b.1", "d");
  equal(res, '{"b":["c","d"]}', "15.02");
  equal(JSON.parse(res), { b: ["c", "d"] }, "15.03");
});

test(`16 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should create intermediate objects`, () => {
  let result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  },
  "c": {
    "d": {
      "e": {
        "f": "l"
      }
    }
  }
}`;
  setter(equal, testObj, result, "c.d.e.f", "l", "06.16");
});

test(`17 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should create intermediate objects - path as array`, () => {
  let result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  },
  "c": {
    "d": {
      "e": {
        "f": "l"
      }
    }
  }
}`;
  setter(equal, testObj, result, ["c", "d", "e", "f"], "l", "06.17");
});

// the hole object-path leaves at index zero serialises as null - the original
// version of this test expected a literal "undefined", which is not JSON
test(`18 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should create intermediate arrays`, () => {
  let result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  },
  "c": [
    [
      null,
      {
        "m": "l"
      }
    ]
  ]
}`;
  setter(equal, testObj, result, "c.0.1.m", "l", "06.18");
});

test(`19 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should create intermediate arrays - path as array`, () => {
  let result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  },
  "c": [
    [
      null,
      {
        "m": "l"
      }
    ]
  ]
}`;
  // object-path picks between making an array and making an object off the
  // TYPE of the next segment, so it reads ["c", "0", 1, "m"] as {"0": [...]}
  // but "c.0.1.m" as [[...]]. Everything here is addressed through a dotted
  // path - main() matches on stringifyPath(path) - so the two spellings are one
  // address, and both build the array. setter()'s object-path leg would be
  // comparing two different questions, so this checks the string and the parsed
  // value directly
  equal(set(testObj, ["c", "0", 1, "m"], "l"), result, "19.01");
  equal(
    JSON.parse(set(testObj, ["c", "0", 1, "m"], "l")),
    JSON.parse(result),
    "19.02",
  );
  equal(
    set(testObj, ["c", "0", 1, "m"], "l"),
    set(testObj, "c.0.1.m", "l"),
    "19.03 - both spellings of the path mean the same thing",
  );
});

test(`20 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set value under integer-like key`, () => {
  let result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  },
  "1a": "foo"
}`;
  setter(equal, testObj, result, "1a", "foo", "06.20");
});

test(`21 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set value under integer-like key - path as array`, () => {
  let result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  },
  "1a": "foo"
}`;
  setter(equal, testObj, result, ["1a"], "foo", "06.21");
});

test(`22 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set value under integer-like key - path as array`, () => {
  setter(equal, "[]", '["foo"]', [0], "foo", "06.22");
});

test(`23 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set value under integer-like key - path as string`, () => {
  setter(equal, "[]", '["foo"]', "0", "foo", "06.23");
});

test.run();
