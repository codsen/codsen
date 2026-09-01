// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import {
  arrayFirstOnly,
  del,
  drop,
  find,
  get,
  set,
} from "../dist/ast-monkey.esm.js";

const _defaultInput = {
  a: { b: [{ c: { d: "e" } }] },
  c: { d: "e" },
};

// -----------------------------------------------------------------------------

test("01 - sets in mixed nested things #1", () => {
  let input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  let index = "7";
  let val = "zzz";
  let actual = set(input, { index, val });
  let intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: "zzz" },
  };

  equal(actual, intended, "01.01");
});

test("02 - sets in mixed nested things #2", () => {
  let input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  let index = "8";
  let val = "zzz";
  let actual = set(input, { index, val });
  let intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["zzz"] },
  };

  equal(actual, intended, "02.01");
});

test("03 - does not set", () => {
  let input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  let index = "99";
  let val = "zzz";
  let actual = set(input, { index, val });
  let intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };

  equal(actual, intended, "03.01");
});

test("04 - sets when only key given instead, index as string", () => {
  let input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  let index = "8";
  let key = "zzz";
  let actual = set(input, { index, key });
  let intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["zzz"] },
  };

  equal(actual, intended, "04.01");
});

test("05 - sets when only key given, numeric index", () => {
  let input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  let index = 8;
  let key = "zzz";
  let actual = set(input, { index, key });
  let intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["zzz"] },
  };

  equal(actual, intended, "05.01");
});

test("06 - throws when inputs are wrong", () => {
  throws(
    () => {
      set(
        { a: "a", b: ["c"] },
        {
          index: "1",
        },
      );
    },
    /THROW_ID_14/g,
    "06.01",
  );
  throws(
    () => {
      set(
        { a: "a" },
        {
          val: "a",
        },
      );
    },
    /THROW_ID_15/g,
    "06.02",
  );
  throws(
    () => {
      set(
        { a: "a" },
        {
          val: "a",
          index: "a",
        },
      );
    },
    /THROW_ID_16/g,
    "06.03",
  );
  throws(
    () => {
      set(
        { a: "a", b: ["c"] },
        {
          val: "a",
          index: 1.5,
        },
      );
    },
    /THROW_ID_16/g,
    "06.04",
  );
});

test.run();
