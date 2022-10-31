/* eslint no-unused-vars:0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  find,
  get,
  set,
  drop,
  del,
  arrayFirstOnly,
} from "../dist/ast-monkey.esm.js";

const defaultInput = {
  a: { b: [{ c: { d: "e" } }] },
  c: { d: "e" },
};

// -----------------------------------------------------------------------------

test("01 - arrayFirstOnly - nested arrays", () => {
  let input = {
    a: { b: ["c", "d", "e"] },
    f: ["g", "h"],
  };

  let actual = arrayFirstOnly(input);
  let intended = {
    a: { b: ["c"] },
    f: ["g"],
  };

  equal(actual, intended, "01.01");
});

test("02 - arrayFirstOnly - arrays within arrays only, no obj", () => {
  let input = [
    ["a", "b", "c"],
    ["d", ["e"]],
  ];
  let actual = arrayFirstOnly(input);
  let intended = [["a"]];

  equal(actual, intended, "02.01");

  // proof that the input was not mutated:
  equal(
    input,
    [
      ["a", "b", "c"],
      ["d", ["e"]],
    ],
    "02.02"
  );
});

test("03 - arrayFirstOnly - nested arrays #2", () => {
  let input = [
    {
      a: "a",
    },
    {
      b: "b",
    },
  ];
  let actual = arrayFirstOnly(input);
  let intended = [
    {
      a: "a",
    },
  ];

  equal(actual, intended, "03.01");
});

test("04 - arrayFirstOnly leaves objects alone", () => {
  let input = {
    a: "a",
    b: {
      c: "c",
    },
  };
  let actual = arrayFirstOnly(input);
  let intended = {
    a: "a",
    b: {
      c: "c",
    },
  };

  equal(actual, intended, "04.01");
});

test("05 - arrayFirstOnly leaves strings alone", () => {
  let input = "zzz";
  let actual = arrayFirstOnly(input);
  let intended = "zzz";

  equal(actual, intended, "05.01");
});

test.run();
