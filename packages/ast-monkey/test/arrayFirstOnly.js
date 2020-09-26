/* eslint no-unused-vars:0 */

import tap from "tap";
import {
  find,
  get,
  set,
  drop,
  del,
  arrayFirstOnly,
} from "../dist/ast-monkey.esm";

const defaultInput = {
  a: { b: [{ c: { d: "e" } }] },
  c: { d: "e" },
};

// -----------------------------------------------------------------------------

tap.test("01 - arrayFirstOnly - nested arrays", (t) => {
  const input = {
    a: { b: ["c", "d", "e"] },
    f: ["g", "h"],
  };

  const actual = arrayFirstOnly(input);
  const intended = {
    a: { b: ["c"] },
    f: ["g"],
  };

  t.strictSame(actual, intended, "01");
  t.end();
});

tap.test("02 - arrayFirstOnly - arrays within arrays only, no obj", (t) => {
  const input = [
    ["a", "b", "c"],
    ["d", ["e"]],
  ];
  const actual = arrayFirstOnly(input);
  const intended = [["a"]];

  t.strictSame(actual, intended, "02.01");

  // proof that the input was not mutated:
  t.strictSame(
    input,
    [
      ["a", "b", "c"],
      ["d", ["e"]],
    ],
    "02.02"
  );
  t.end();
});

tap.test("03 - arrayFirstOnly - nested arrays #2", (t) => {
  const input = [
    {
      a: "a",
    },
    {
      b: "b",
    },
  ];
  const actual = arrayFirstOnly(input);
  const intended = [
    {
      a: "a",
    },
  ];

  t.strictSame(actual, intended, "03");
  t.end();
});

tap.test("04 - arrayFirstOnly leaves objects alone", (t) => {
  const input = {
    a: "a",
    b: {
      c: "c",
    },
  };
  const actual = arrayFirstOnly(input);
  const intended = {
    a: "a",
    b: {
      c: "c",
    },
  };

  t.strictSame(actual, intended, "04");
  t.end();
});

tap.test("05 - arrayFirstOnly leaves strings alone", (t) => {
  const input = "zzz";
  const actual = arrayFirstOnly(input);
  const intended = "zzz";

  t.strictSame(actual, intended, "05");
  t.end();
});
