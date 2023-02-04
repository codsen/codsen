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

test("01 - gets from a simple object #1", () => {
  let input = {
    a: {
      b: "c",
    },
  };
  let index = 1;
  let actual = get(input, { index });
  let intended = {
    a: { b: "c" },
  };
  equal(actual, intended, "01.01");
});

test("02 - gets from a simple object #2", () => {
  let input = {
    a: {
      b: "c",
    },
  };
  let index = 2;
  let actual = get(input, { index });
  let intended = {
    b: "c",
  };
  equal(actual, intended, "02.01");
});

test("03 - gets from a simple object #3", () => {
  let input = {
    a: {
      b: ["c"],
    },
  };
  let index = 3;
  let actual = get(input, { index });
  let intended = "c";
  equal(actual, intended, "03.01");
});

test("04 - does not get", () => {
  let input = {
    a: {
      b: ["c"],
    },
  };
  let index = 4;
  let actual = get(input, { index });
  let intended = null;
  equal(actual, intended, "04.01");
});

test("05 - gets from a simple array", () => {
  let input = ["a", [["b"], "c"]];
  let index = 4;
  let actual = get(input, { index });
  let intended = "b";
  equal(actual, intended, "05.01");
});

test("06 - gets from mixed nested things, index string", () => {
  let input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  let index = "7";
  let actual = get(input, { index });
  let intended = {
    g: ["h"],
  };

  equal(actual, intended, "06.01");
});

test("07 - gets from a simple object, index is string", () => {
  let input = {
    a: {
      b: "c",
    },
  };
  let index = "2";
  let actual = get(input, { index });
  let intended = {
    b: "c",
  };
  equal(actual, intended, "07.01");
});

test("08 - index is real number as string - throws", () => {
  throws(
    () => {
      get(
        {
          a: {
            b: "c",
          },
        },
        {
          index: "2.1",
        }
      );
    },
    /THROW_ID_11/g,
    "08.01"
  );
});

test.run();
