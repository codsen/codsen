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

test("01 - drops in mixed things #1 - index string", () => {
  let input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  let index = "8";
  let actual = drop(input, { index });
  let intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: [] },
  };

  equal(actual, intended, "01.01");
});

test("02 - drops in mixed things #2 - index number", () => {
  let input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  let index = 7;
  let actual = drop(input, { index });
  let intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: {},
  };

  equal(actual, intended, "02.01");
});

test("03 - does not drop - zero", () => {
  let input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  let index = "0";
  let actual = drop(input, { index });
  let intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };

  equal(actual, intended, "03.01");
});

test("04 - does not drop - 99", () => {
  let input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  let index = "99";
  let actual = drop(input, { index });
  let intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };

  equal(actual, intended, "04.01");
});

test("05 - drops in mixed things #3 - index is not a natural number", () => {
  let input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  let index = "6.1";
  throws(
    () => {
      drop(input, { index });
    },
    /THROW_ID_22/g,
    "05.01",
  );
});

test.run();
