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

tap.test("01 - sets in mixed nested things #1", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = "7";
  const val = "zzz";
  const actual = set(input, { index, val });
  const intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: "zzz" },
  };

  t.strictSame(actual, intended, "01");
  t.end();
});

tap.test("02 - sets in mixed nested things #2", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = "8";
  const val = "zzz";
  const actual = set(input, { index, val });
  const intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["zzz"] },
  };

  t.strictSame(actual, intended, "02");
  t.end();
});

tap.test("03 - does not set", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = "99";
  const val = "zzz";
  const actual = set(input, { index, val });
  const intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };

  t.strictSame(actual, intended, "03");
  t.end();
});

tap.test("04 - sets when only key given instead, index as string", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = "8";
  const key = "zzz";
  const actual = set(input, { index, key });
  const intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["zzz"] },
  };

  t.strictSame(actual, intended, "04");
  t.end();
});

tap.test("05 - sets when only key given, numeric index", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = 8;
  const key = "zzz";
  const actual = set(input, { index, key });
  const intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["zzz"] },
  };

  t.strictSame(actual, intended, "05");
  t.end();
});

tap.test("06 - throws when inputs are wrong", (t) => {
  t.throws(() => {
    set(
      { a: "a", b: ["c"] },
      {
        index: "1",
      }
    );
  }, /THROW_ID_14/g);
  t.throws(() => {
    set(
      { a: "a" },
      {
        val: "a",
      }
    );
  }, /THROW_ID_15/g);
  t.throws(() => {
    set(
      { a: "a" },
      {
        val: "a",
        index: "a",
      }
    );
  }, /THROW_ID_17/g);
  t.throws(() => {
    set(
      { a: "a", b: ["c"] },
      {
        val: "a",
        index: 1.5,
      }
    );
  }, /THROW_ID_17/g);
  t.end();
});
