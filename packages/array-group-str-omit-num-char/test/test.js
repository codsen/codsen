import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { groupStr as group } from "../dist/array-group-str-omit-num-char.esm.js";

// ==============
// 00. Edge cases
// ==============

test("01 - throws when the first argument is not array", () => {
  equal(group(), undefined, "01.01");
  equal(group([]), {}, "01.02");
});

test("02 - second argument can be faulty, opts is simply reset", () => {
  equal(
    group(["aaa", "bbb"], true),
    {
      aaa: 1,
      bbb: 1,
    },
    "02.01"
  );
  equal(
    group(["aaa", "bbb"], null),
    {
      aaa: 1,
      bbb: 1,
    },
    "02.02"
  );
  equal(
    group(["aaa", "bbb"], undefined),
    {
      aaa: 1,
      bbb: 1,
    },
    "02.03"
  );
  equal(
    group(["aaa", "bbb"], {}),
    {
      aaa: 1,
      bbb: 1,
    },
    "02.04"
  );
});

// =======
// 01. BAU
// =======

test("03 - groups two kinds", () => {
  equal(
    group(["aaaaaa1-1", "aaaaaa1-2", "bbbbbb", "aaaaaa1-3"]),
    {
      "aaaaaa1-*": 3,
      bbbbbb: 1,
    },
    "03"
  );
});

test("04 - sneaky - wildcard pattern changes later in the traverse", () => {
  equal(
    group(["aaaaaa1-1", "aaaaaa1-2", "bbbbbb", "aaaaaa2-3"]),
    {
      "aaaaaa*-*": 3,
      bbbbbb: 1,
    },
    "04"
  );
});

test("05 - all contain digits and all are unique", () => {
  equal(
    group(["a1-1", "b2-2", "c3-3", "d4-4"]),
    {
      "a1-1": 1,
      "b2-2": 1,
      "c3-3": 1,
      "d4-4": 1,
    },
    "05.01"
  );
  equal(
    group(["a1-1", "a2-2", "b3-3", "c4-4"]),
    {
      "a*-*": 2,
      "b3-3": 1,
      "c4-4": 1,
    },
    "05.02"
  );
  equal(
    group(["a1-1", "a1-2", "b3-3", "c4-4"]),
    {
      "a1-*": 2,
      "b3-3": 1,
      "c4-4": 1,
    },
    "05.03"
  );
});

test("06 - nothing to group, one character", () => {
  equal(
    group(["a", "b"]),
    {
      a: 1,
      b: 1,
    },
    "06"
  );
});

test("07 - concerning dedupe", () => {
  equal(
    group(["a-1", "a-1", "a-1"]),
    {
      "a-1": 1,
    },
    "07.01 - default behaviour - dedupe is on"
  );
  equal(
    group(["a-1", "a-1", "a-1"], { dedupePlease: false }),
    {
      "a-1": 3,
    },
    "07.02 - dedupe is off"
  );
});

// ==========
// 02. ad-hoc
// ==========

test("08 - does not mutate the input array", () => {
  let source = ["aaaaaa1-1", "aaaaaa1-2", "bbbbbb", "aaaaaa1-3"];
  group(source); // attempt to mutate
  equal(
    source,
    ["aaaaaa1-1", "aaaaaa1-2", "bbbbbb", "aaaaaa1-3"],
    "08.01 - even after couple rounds the input arg is not mutated"
  );
});

test("09 - does not mutate an empty given array", () => {
  let source = [];
  group(Object.keys(group(source)));
  equal(source, [], "09.01");
});

// =================
// 03. opts.wildcard
// =================

test("10 - opts.wildcard", () => {
  equal(
    group(["a-1", "a-2", "a-333333", "b-1", "b-99999"]),
    {
      "a-*": 3,
      "b-*": 2,
    },
    "10.01 - default, asterisk is used for wildcards"
  );
  equal(
    group(["a-1", "a-2", "a-333333", "b-1", "b-99999"], {
      wildcard: "z",
    }),
    {
      "a-z": 3,
      "b-z": 2,
    },
    "10.02"
  );
});

test.run();
