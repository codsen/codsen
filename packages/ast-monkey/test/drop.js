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

tap.test("01 - drops in mixed things #1 - index string", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = "8";
  const actual = drop(input, { index });
  const intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: [] },
  };

  t.strictSame(actual, intended, "01");
  t.end();
});

tap.test("02 - drops in mixed things #2 - index number", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = 7;
  const actual = drop(input, { index });
  const intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: {},
  };

  t.strictSame(actual, intended, "02");
  t.end();
});

tap.test("03 - does not drop - zero", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = "0";
  const actual = drop(input, { index });
  const intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };

  t.strictSame(actual, intended, "03");
  t.end();
});

tap.test("04 - does not drop - 99", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = "99";
  const actual = drop(input, { index });
  const intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };

  t.strictSame(actual, intended, "04");
  t.end();
});

tap.test(
  "05 - drops in mixed things #3 - index is not a natural number",
  (t) => {
    const input = {
      a: { b: [{ c: { d: "e" } }] },
      f: { g: ["h"] },
    };
    const index = "6.1";
    t.throws(() => {
      drop(input, { index });
    }, /THROW_ID_23/g);
    t.end();
  }
);
