// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { compare } from "../dist/ast-compare.esm.js";

test("01 - plain objects", () => {
  type(
    compare(
      { a: "1", b: "2" },
      { a: "1", b: "2", c: "3" },
      { verboseWhenMismatches: true },
    ),
    "string",
    "01.01",
  );
});

test("02 - plain objects, useWildcards, key with wildcard", () => {
  type(
    compare(
      { a: "1", b: "2" },
      { a: "1", b: "2", "c*": "3" },
      { verboseWhenMismatches: true, useWildcards: true },
    ),
    "string",
    "02.01",
  );
});

test("03 - mismatch messages label nested value types", () => {
  type(
    compare({ a: [] }, { a: null }, { verboseWhenMismatches: true }),
    "string",
    "03.01",
  );
  type(
    compare({ a: {} }, { a: "" }, { verboseWhenMismatches: true }),
    "string",
    "03.02",
  );
  equal(
    compare(new Date(0), new Date(0), {
      hungryForWhitespace: true,
      matchStrictly: true,
    }),
    false,
    "03.03",
  );
});

test.run();
