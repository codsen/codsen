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

tap.test("01 - deletes by key, multiple findings", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    c: { d: ["h"] },
  };
  t.strictSame(
    del(input, { key: "c" }),
    {
      a: { b: [{}] },
    },
    "01.01"
  );
  t.strictSame(
    del(input, { key: "c", only: "array" }),
    {
      a: { b: [{ c: { d: "e" } }] },
      c: { d: ["h"] },
    },
    "01.02 - only array"
  );
  t.strictSame(
    del(input, { key: "c", only: "o" }),
    {
      a: { b: [{}] },
    },
    "01.03"
  );
  t.strictSame(
    del(input, { key: "c", only: "whatever" }),
    {
      a: { b: [{}] },
    },
    "01.04"
  );
  t.end();
});

tap.test("02 - deletes by key, multiple findings at the same branch", (t) => {
  const input = {
    a: { b: [{ c: { c: "e" } }] },
    c: { d: ["h"] },
  };
  t.strictSame(
    del(input, { key: "c" }),
    {
      a: { b: [{}] },
    },
    "02"
  );
  t.end();
});

tap.test("03 - can't find any to delete by key", (t) => {
  const input = {
    a: { b: [{ c: { c: "e" } }] },
    c: { d: ["h"] },
  };
  t.strictSame(
    del(input, { key: "zzz" }),
    {
      a: { b: [{ c: { c: "e" } }] },
      c: { d: ["h"] },
    },
    "03"
  );
  t.end();
});

tap.test("04 - deletes by value only from mixed", (t) => {
  const input = {
    a: { b: [{ ktjyklrjtyjlkl: { c: "e" } }] },
    dflshgdlfgh: { c: "e" },
  };
  t.strictSame(
    del(input, { val: { c: "e" } }),
    {
      a: { b: [{}] },
    },
    "04"
  );
  t.end();
});

tap.test("05 - deletes by value only from arrays", (t) => {
  const input = ["a", "b", "c", ["a", ["b"], "c"]];
  t.strictSame(del(input, { key: "b" }), ["a", "c", ["a", [], "c"]], "05");
  t.end();
});

tap.test("06 - deletes by key and value from mixed", (t) => {
  const input = {
    a: { b: [{ c: { d: { e: "f" } } }] },
    f: { d: { zzz: "f" } },
  };
  t.strictSame(
    del(input, { key: "d", val: { e: "f" } }),
    {
      a: { b: [{ c: {} }] },
      f: { d: { zzz: "f" } },
    },
    "06"
  );
  t.end();
});

tap.test("07 - does not delete by key and value from arrays", (t) => {
  const input = ["a", "b", "c", ["a", ["b"], "c"]];
  t.strictSame(
    del(input, { key: "b", val: "zzz" }),
    ["a", "b", "c", ["a", ["b"], "c"]],
    "07"
  );
  t.end();
});

tap.test("08 - deletes by key and value from mixed", (t) => {
  const input = {
    a: {
      b: "",
      c: "d",
      e: "f",
    },
  };
  t.strictSame(
    del(input, { key: "b", val: "" }),
    {
      a: {
        c: "d",
        e: "f",
      },
    },
    "08"
  );
  t.end();
});

tap.test("09 - sneaky-one: object keys have values as null", (t) => {
  const input = {
    a: { b: [{ c: null }] },
    c: null,
  };
  t.strictSame(
    del(input, { key: "c" }),
    {
      a: { b: [{}] },
    },
    "09.01"
  );
  t.strictSame(
    del(input, { key: "c", only: "array" }),
    input,
    "09.02 - only array"
  );
  t.strictSame(
    del(input, { key: "c", only: "object" }),
    {
      a: { b: [{}] },
    },
    "09.03"
  );
  t.end();
});
