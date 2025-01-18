import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

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

test.run();
