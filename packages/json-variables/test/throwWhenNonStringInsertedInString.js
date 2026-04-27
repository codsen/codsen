// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { jVar } from "../dist/json-variables.esm.js";

test("01 - baseline, number", () => {
  equal(
    jVar(
      {
        a: "foo %%_b_%% bar",
        b: 2,
      },
      {
        throwWhenNonStringInsertedInString: false,
      },
    ),
    {
      a: "foo 2 bar",
      b: 2,
    },
    "01.01",
  );
});

test("02 - baseline, string", () => {
  equal(
    jVar(
      {
        a: "foo %%_b_%% bar",
        b: "x",
      },
      {
        throwWhenNonStringInsertedInString: false,
      },
    ),
    {
      a: "foo x bar",
      b: "x",
    },
    "02.01",
  );
});

test("03 - enabling the option it will NOT throw if it's a string", () => {
  equal(
    jVar(
      {
        a: "foo %%_b_%% bar",
        b: "x",
      },
      {
        throwWhenNonStringInsertedInString: false,
      },
    ),
    {
      a: "foo x bar",
      b: "x",
    },
    "03.01",
  );
});

test("04 - enabling the option it will throw if it's a number", () => {
  throws(
    () => {
      jVar(
        {
          a: "foo %%_b_%% bar",
          b: 2,
        },
        {
          throwWhenNonStringInsertedInString: true,
        },
      );
    },
    /THROW_ID_04/,
    "04.01",
  );
});

test.run();
