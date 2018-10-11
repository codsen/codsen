import test from "ava";
import group from "../dist/array-group-str-omit-num-char.esm";

// ==============
// 00. Edge cases
// ==============

test("00.01 - throws when the first argument is not array", t => {
  const error1 = t.throws(() => {
    group();
  });
  t.regex(error1.message, /THROW_ID_01/);
});

test("00.02 - throws when the second argument, opts is not a plain object", t => {
  const error1 = t.throws(() => {
    group(["aaa", "bbb"], true);
  });
  t.regex(error1.message, /THROW_ID_02/);

  const error2 = t.throws(() => {
    group(["aaa", "bbb"], 1);
  });
  t.regex(error2.message, /THROW_ID_02/);

  const error3 = t.throws(() => {
    group(["aaa", "bbb"], []);
  });
  t.regex(error3.message, /THROW_ID_02/);

  // but does not throw if it's null, undefined or empty object:

  t.deepEqual(group(["aaa", "bbb"], null), {
    aaa: 1,
    bbb: 1
  });

  t.deepEqual(group(["aaa", "bbb"], undefined), {
    aaa: 1,
    bbb: 1
  });

  t.deepEqual(group(["aaa", "bbb"], {}), {
    aaa: 1,
    bbb: 1
  });
});

test("00.03 - throws when opts values are of a wrong type or opts contain rogue keys", t => {
  // wrong value type:
  const error1 = t.throws(() => {
    group(["aaa", "bbb"], {
      wildcard: true
    });
  });
  t.regex(error1.message, /THROW_ID_03/);

  // rogue opts key:
  const error2 = t.throws(() => {
    group(["aaa", "bbb"], {
      wildcard: "*",
      tralala: true
    });
  });
  t.regex(error2.message, /THROW_ID_03/);

  // custom wildcard
  const error3 = t.throws(() => {
    group(["aaa", "bbb"], {
      wildcard: "z",
      tralala: true
    });
  });
  t.regex(error3.message, /THROW_ID_03/);
});

test("00.04 - empty array input", t => {
  t.deepEqual(group([]), {}, "00.04");
});

// =======
// 01. BAU
// =======

test("01.01 - groups two kinds", t => {
  t.deepEqual(
    group(["aaaaaa1-1", "aaaaaa1-2", "bbbbbb", "aaaaaa1-3"]),
    {
      "aaaaaa1-*": 3,
      bbbbbb: 1
    },
    "01.01"
  );
});

test("01.02 - sneaky - wildcard pattern changes later in the traverse", t => {
  t.deepEqual(
    group(["aaaaaa1-1", "aaaaaa1-2", "bbbbbb", "aaaaaa2-3"]),
    {
      "aaaaaa*-*": 3,
      bbbbbb: 1
    },
    "01.02"
  );
});

test("01.03 - all contain digits and all are unique", t => {
  t.deepEqual(
    group(["a1-1", "b2-2", "c3-3", "d4-4"]),
    {
      "a1-1": 1,
      "b2-2": 1,
      "c3-3": 1,
      "d4-4": 1
    },
    "01.03.01"
  );
  t.deepEqual(
    group(["a1-1", "a2-2", "b3-3", "c4-4"]),
    {
      "a*-*": 2,
      "b3-3": 1,
      "c4-4": 1
    },
    "01.03.02"
  );
  t.deepEqual(
    group(["a1-1", "a1-2", "b3-3", "c4-4"]),
    {
      "a1-*": 2,
      "b3-3": 1,
      "c4-4": 1
    },
    "01.03.03"
  );
});

test("01.04 - nothing to group, one character", t => {
  t.deepEqual(
    group(["a", "b"]),
    {
      a: 1,
      b: 1
    },
    "01.04"
  );
});

test("01.05 - concerning dedupe", t => {
  t.deepEqual(
    group(["a-1", "a-1", "a-1"]),
    {
      "a-1": 1
    },
    "01.05.01 - default behaviour - dedupe is on"
  );
  t.deepEqual(
    group(["a-1", "a-1", "a-1"], { dedupePlease: false }),
    {
      "a-1": 3
    },
    "01.05.02 - dedupe is off"
  );
});

// ==========
// 02. ad-hoc
// ==========

test("02.01 - does not mutate the input array", t => {
  const source = ["aaaaaa1-1", "aaaaaa1-2", "bbbbbb", "aaaaaa1-3"];
  const res = group(Object.keys(group(source)));
  t.pass(res);
  t.deepEqual(
    source,
    ["aaaaaa1-1", "aaaaaa1-2", "bbbbbb", "aaaaaa1-3"],
    "02.01 - even after couple rounds the input arg is not mutated"
  );
});

test("02.02 - does not mutate an empty given array", t => {
  const source = [];
  const res = group(Object.keys(group(source)));
  t.pass(res);
  t.deepEqual(source, [], "02.02");
});

// =================
// 03. opts.wildcard
// =================

test("03.01 - opts.wildcard", t => {
  t.deepEqual(
    group(["a-1", "a-2", "a-333333", "b-1", "b-99999"]),
    {
      "a-*": 3,
      "b-*": 2
    },
    "03.01 - default, asterisk is used for wildcards"
  );
  t.deepEqual(
    group(["a-1", "a-2", "a-333333", "b-1", "b-99999"], {
      wildcard: "z"
    }),
    {
      "a-z": 3,
      "b-z": 2
    },
    "03.01.02"
  );
});
