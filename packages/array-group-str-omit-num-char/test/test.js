import t from "tap";
import group from "../dist/array-group-str-omit-num-char.esm";

// ==============
// 00. Edge cases
// ==============

t.test("00.01 - throws when the first argument is not array", (t) => {
  t.equal(group(), undefined, "00.01");
  t.same(group([]), {}, "00.04");
  t.end();
});

t.test("00.02 - second argument can be faulty, opts is simply reset", (t) => {
  t.same(
    group(["aaa", "bbb"], true),
    {
      aaa: 1,
      bbb: 1,
    },
    "00.02.01"
  );
  t.same(
    group(["aaa", "bbb"], null),
    {
      aaa: 1,
      bbb: 1,
    },
    "00.02.02"
  );
  t.same(
    group(["aaa", "bbb"], undefined),
    {
      aaa: 1,
      bbb: 1,
    },
    "00.02.03"
  );
  t.same(
    group(["aaa", "bbb"], {}),
    {
      aaa: 1,
      bbb: 1,
    },
    "00.02.04"
  );
  t.end();
});

// =======
// 01. BAU
// =======

t.test("01.01 - groups two kinds", (t) => {
  t.same(
    group(["aaaaaa1-1", "aaaaaa1-2", "bbbbbb", "aaaaaa1-3"]),
    {
      "aaaaaa1-*": 3,
      bbbbbb: 1,
    },
    "01.01"
  );
  t.end();
});

t.test(
  "01.02 - sneaky - wildcard pattern changes later in the traverse",
  (t) => {
    t.same(
      group(["aaaaaa1-1", "aaaaaa1-2", "bbbbbb", "aaaaaa2-3"]),
      {
        "aaaaaa*-*": 3,
        bbbbbb: 1,
      },
      "01.02"
    );
    t.end();
  }
);

t.test("01.03 - all contain digits and all are unique", (t) => {
  t.same(
    group(["a1-1", "b2-2", "c3-3", "d4-4"]),
    {
      "a1-1": 1,
      "b2-2": 1,
      "c3-3": 1,
      "d4-4": 1,
    },
    "01.03.01"
  );
  t.same(
    group(["a1-1", "a2-2", "b3-3", "c4-4"]),
    {
      "a*-*": 2,
      "b3-3": 1,
      "c4-4": 1,
    },
    "01.03.02"
  );
  t.same(
    group(["a1-1", "a1-2", "b3-3", "c4-4"]),
    {
      "a1-*": 2,
      "b3-3": 1,
      "c4-4": 1,
    },
    "01.03.03"
  );
  t.end();
});

t.test("01.04 - nothing to group, one character", (t) => {
  t.same(
    group(["a", "b"]),
    {
      a: 1,
      b: 1,
    },
    "01.04"
  );
  t.end();
});

t.test("01.05 - concerning dedupe", (t) => {
  t.same(
    group(["a-1", "a-1", "a-1"]),
    {
      "a-1": 1,
    },
    "01.05.01 - default behaviour - dedupe is on"
  );
  t.same(
    group(["a-1", "a-1", "a-1"], { dedupePlease: false }),
    {
      "a-1": 3,
    },
    "01.05.02 - dedupe is off"
  );
  t.end();
});

// ==========
// 02. ad-hoc
// ==========

t.test("02.01 - does not mutate the input array", (t) => {
  const source = ["aaaaaa1-1", "aaaaaa1-2", "bbbbbb", "aaaaaa1-3"];
  const res = group(Object.keys(group(source)));
  t.pass(res);
  t.same(
    source,
    ["aaaaaa1-1", "aaaaaa1-2", "bbbbbb", "aaaaaa1-3"],
    "02.01 - even after couple rounds the input arg is not mutated"
  );
  t.end();
});

t.test("02.02 - does not mutate an empty given array", (t) => {
  const source = [];
  const res = group(Object.keys(group(source)));
  t.pass(res);
  t.same(source, [], "02.02");
  t.end();
});

// =================
// 03. opts.wildcard
// =================

t.test("03.01 - opts.wildcard", (t) => {
  t.same(
    group(["a-1", "a-2", "a-333333", "b-1", "b-99999"]),
    {
      "a-*": 3,
      "b-*": 2,
    },
    "03.01 - default, asterisk is used for wildcards"
  );
  t.same(
    group(["a-1", "a-2", "a-333333", "b-1", "b-99999"], {
      wildcard: "z",
    }),
    {
      "a-z": 3,
      "b-z": 2,
    },
    "03.01.02"
  );
  t.end();
});
