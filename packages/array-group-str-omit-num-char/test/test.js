import tap from "tap";
import group from "../dist/array-group-str-omit-num-char.esm";

// ==============
// 00. Edge cases
// ==============

tap.test("01 - throws when the first argument is not array", (t) => {
  t.equal(group(), undefined, "01.01");
  t.strictSame(group([]), {}, "01.02");
  t.end();
});

tap.test("02 - second argument can be faulty, opts is simply reset", (t) => {
  t.strictSame(
    group(["aaa", "bbb"], true),
    {
      aaa: 1,
      bbb: 1,
    },
    "02.01"
  );
  t.strictSame(
    group(["aaa", "bbb"], null),
    {
      aaa: 1,
      bbb: 1,
    },
    "02.02"
  );
  t.strictSame(
    group(["aaa", "bbb"], undefined),
    {
      aaa: 1,
      bbb: 1,
    },
    "02.03"
  );
  t.strictSame(
    group(["aaa", "bbb"], {}),
    {
      aaa: 1,
      bbb: 1,
    },
    "02.04"
  );
  t.end();
});

// =======
// 01. BAU
// =======

tap.test("03 - groups two kinds", (t) => {
  t.strictSame(
    group(["aaaaaa1-1", "aaaaaa1-2", "bbbbbb", "aaaaaa1-3"]),
    {
      "aaaaaa1-*": 3,
      bbbbbb: 1,
    },
    "03"
  );
  t.end();
});

tap.test(
  "04 - sneaky - wildcard pattern changes later in the traverse",
  (t) => {
    t.strictSame(
      group(["aaaaaa1-1", "aaaaaa1-2", "bbbbbb", "aaaaaa2-3"]),
      {
        "aaaaaa*-*": 3,
        bbbbbb: 1,
      },
      "04"
    );
    t.end();
  }
);

tap.test("05 - all contain digits and all are unique", (t) => {
  t.strictSame(
    group(["a1-1", "b2-2", "c3-3", "d4-4"]),
    {
      "a1-1": 1,
      "b2-2": 1,
      "c3-3": 1,
      "d4-4": 1,
    },
    "05.01"
  );
  t.strictSame(
    group(["a1-1", "a2-2", "b3-3", "c4-4"]),
    {
      "a*-*": 2,
      "b3-3": 1,
      "c4-4": 1,
    },
    "05.02"
  );
  t.strictSame(
    group(["a1-1", "a1-2", "b3-3", "c4-4"]),
    {
      "a1-*": 2,
      "b3-3": 1,
      "c4-4": 1,
    },
    "05.03"
  );
  t.end();
});

tap.test("06 - nothing to group, one character", (t) => {
  t.strictSame(
    group(["a", "b"]),
    {
      a: 1,
      b: 1,
    },
    "06"
  );
  t.end();
});

tap.test("07 - concerning dedupe", (t) => {
  t.strictSame(
    group(["a-1", "a-1", "a-1"]),
    {
      "a-1": 1,
    },
    "07.01 - default behaviour - dedupe is on"
  );
  t.strictSame(
    group(["a-1", "a-1", "a-1"], { dedupePlease: false }),
    {
      "a-1": 3,
    },
    "07.02 - dedupe is off"
  );
  t.end();
});

// ==========
// 02. ad-hoc
// ==========

tap.test("08 - does not mutate the input array", (t) => {
  const source = ["aaaaaa1-1", "aaaaaa1-2", "bbbbbb", "aaaaaa1-3"];
  const res = group(Object.keys(group(source)));
  t.pass(res);
  t.strictSame(
    source,
    ["aaaaaa1-1", "aaaaaa1-2", "bbbbbb", "aaaaaa1-3"],
    "08.01 - even after couple rounds the input arg is not mutated"
  );
  t.end();
});

tap.test("09 - does not mutate an empty given array", (t) => {
  const source = [];
  const res = group(Object.keys(group(source)));
  t.pass(res);
  t.strictSame(source, [], "09.01");
  t.end();
});

// =================
// 03. opts.wildcard
// =================

tap.test("10 - opts.wildcard", (t) => {
  t.strictSame(
    group(["a-1", "a-2", "a-333333", "b-1", "b-99999"]),
    {
      "a-*": 3,
      "b-*": 2,
    },
    "10.01 - default, asterisk is used for wildcards"
  );
  t.strictSame(
    group(["a-1", "a-2", "a-333333", "b-1", "b-99999"], {
      wildcard: "z",
    }),
    {
      "a-z": 3,
      "b-z": 2,
    },
    "10.02"
  );
  t.end();
});
