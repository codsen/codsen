/* eslint no-unused-vars:0 */

import tap from "tap";
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

tap.test("01 - gets from a simple object #1", (t) => {
  const input = {
    a: {
      b: "c",
    },
  };
  const index = 1;
  const actual = get(input, { index });
  const intended = {
    a: { b: "c" },
  };
  t.strictSame(actual, intended, "01");
  t.end();
});

tap.test("02 - gets from a simple object #2", (t) => {
  const input = {
    a: {
      b: "c",
    },
  };
  const index = 2;
  const actual = get(input, { index });
  const intended = {
    b: "c",
  };
  t.strictSame(actual, intended, "02");
  t.end();
});

tap.test("03 - gets from a simple object #3", (t) => {
  const input = {
    a: {
      b: ["c"],
    },
  };
  const index = 3;
  const actual = get(input, { index });
  const intended = "c";
  t.strictSame(actual, intended, "03");
  t.end();
});

tap.test("04 - does not get", (t) => {
  const input = {
    a: {
      b: ["c"],
    },
  };
  const index = 4;
  const actual = get(input, { index });
  const intended = null;
  t.strictSame(actual, intended, "04");
  t.end();
});

tap.test("05 - gets from a simple array", (t) => {
  const input = ["a", [["b"], "c"]];
  const index = 4;
  const actual = get(input, { index });
  const intended = "b";
  t.strictSame(actual, intended, "05");
  t.end();
});

tap.test("06 - gets from mixed nested things, index string", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = "7";
  const actual = get(input, { index });
  const intended = {
    g: ["h"],
  };

  t.strictSame(actual, intended, "06");
  t.end();
});

tap.test("07 - gets from a simple object, index is string", (t) => {
  const input = {
    a: {
      b: "c",
    },
  };
  const index = "2";
  const actual = get(input, { index });
  const intended = {
    b: "c",
  };
  t.strictSame(actual, intended, "07");
  t.end();
});

tap.test("08 - index is real number as string - throws", (t) => {
  t.throws(() => {
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
  }, /THROW_ID_11/g);
  t.end();
});
