import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
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

test("01 - deletes by key, multiple findings", () => {
  let input = {
    a: { b: [{ c: { d: "e" } }] },
    c: { d: ["h"] },
  };
  equal(
    del(input, { key: "c" }),
    {
      a: { b: [{}] },
    },
    "01.01",
  );
  equal(
    del(input, { key: "c", only: "array" }),
    {
      a: { b: [{ c: { d: "e" } }] },
      c: { d: ["h"] },
    },
    "01.02",
  );
  equal(
    del(input, { key: "c", only: "o" }),
    {
      a: { b: [{}] },
    },
    "01.03",
  );
  equal(
    del(input, { key: "c", only: "whatever" }),
    {
      a: { b: [{}] },
    },
    "01.04",
  );
});

test("02 - deletes by key, multiple findings at the same branch", () => {
  let input = {
    a: { b: [{ c: { c: "e" } }] },
    c: { d: ["h"] },
  };
  equal(
    del(input, { key: "c" }),
    {
      a: { b: [{}] },
    },
    "02.01",
  );
});

test("03 - can't find any to delete by key", () => {
  let input = {
    a: { b: [{ c: { c: "e" } }] },
    c: { d: ["h"] },
  };
  equal(
    del(input, { key: "zzz" }),
    {
      a: { b: [{ c: { c: "e" } }] },
      c: { d: ["h"] },
    },
    "03.01",
  );
});

test("04 - deletes by value only from mixed", () => {
  let input = {
    a: { b: [{ ktjyklrjtyjlkl: { c: "e" } }] },
    dflshgdlfgh: { c: "e" },
  };
  equal(
    del(input, { val: { c: "e" } }),
    {
      a: { b: [{}] },
    },
    "04.01",
  );
});

test("05 - deletes by value only from arrays", () => {
  let input = ["a", "b", "c", ["a", ["b"], "c"]];
  equal(del(input, { key: "b" }), ["a", "c", ["a", [], "c"]], "05.01");
});

test("06 - deletes by key and value from mixed", () => {
  let input = {
    a: { b: [{ c: { d: { e: "f" } } }] },
    f: { d: { zzz: "f" } },
  };
  equal(
    del(input, { key: "d", val: { e: "f" } }),
    {
      a: { b: [{ c: {} }] },
      f: { d: { zzz: "f" } },
    },
    "06.01",
  );
});

test("07 - does not delete by key and value from arrays", () => {
  let input = ["a", "b", "c", ["a", ["b"], "c"]];
  equal(
    del(input, { key: "b", val: "zzz" }),
    ["a", "b", "c", ["a", ["b"], "c"]],
    "07.01",
  );
});

test("08 - deletes by key and value from mixed", () => {
  let input = {
    a: {
      b: "",
      c: "d",
      e: "f",
    },
  };
  equal(
    del(input, { key: "b", val: "" }),
    {
      a: {
        c: "d",
        e: "f",
      },
    },
    "08.01",
  );
});

test("09 - undefined as value", () => {
  let input = {
    a: undefined,
    b: "foo",
  };
  equal(
    del(input, { key: "b" }),
    {
      a: undefined,
    },
    "09.01",
  );
});

test("10 - sneaky-one: object keys have values as null", () => {
  let input = {
    a: { b: [{ c: null }] },
    c: null,
  };
  equal(
    del(input, { key: "c" }),
    {
      a: { b: [{}] },
    },
    "10.01",
  );
  equal(del(input, { key: "c", only: "array" }), input, "10.02");
  equal(
    del(input, { key: "c", only: "object" }),
    {
      a: { b: [{}] },
    },
    "10.03",
  );
});

test("11 - sneaky-one: object keys have values as undefined", () => {
  let input = {
    a: { b: [{ c: undefined }] },
    c: undefined,
  };
  equal(
    del(input, { key: "c" }),
    {
      a: { b: [{}] },
    },
    "11.01",
  );
  equal(del(input, { key: "c", only: "array" }), input, "11.02");
  equal(
    del(input, { key: "c", only: "object" }),
    {
      a: { b: [{}] },
    },
    "11.03",
  );
});

test.run();
