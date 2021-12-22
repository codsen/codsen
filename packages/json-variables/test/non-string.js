/* eslint no-template-curly-in-string: 0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { jVar } from "../dist/json-variables.esm.js";

test("01 - Boolean values inserted into a middle of a string", () => {
  equal(
    jVar({
      a: "%%_b_%% %%_c_%% %%_d_%% %%_e_%%",
      b: "stringB",
      c: true,
      d: "stringD",
      e: false,
    }),
    {
      a: false, // <------ first Boolean value is put here. "b" was string, so "c = true" goes here.
      b: "stringB",
      c: true,
      d: "stringD",
      e: false,
    },
    "01.01 - mix of Bools and strings resolve to the value of the first encountered Bool"
  );
  equal(
    jVar(
      {
        a: "%%_b_%% %%_c_%% %%_d_%% %%_e_%%",
        b: "stringB",
        c: true,
        d: "stringD",
        e: false,
      },
      {
        resolveToBoolIfAnyValuesContainBool: false,
      }
    ),
    {
      a: "stringB  stringD ",
      b: "stringB",
      c: true,
      d: "stringD",
      e: false,
    },
    "01.02"
  );
  equal(
    jVar(
      {
        a: "%%_b_%% %%_c_%% %%_d_%% %%_e_%%",
        b: "stringB",
        c: true,
        d: "stringD",
        e: false,
      },
      { resolveToFalseIfAnyValuesContainBool: false }
    ),
    {
      a: true, // <------ first Boolean value is put here. "b" was string, so "c = true" goes here.
      b: "stringB",
      c: true,
      d: "stringD",
      e: false,
    },
    "01.03"
  );
  equal(
    jVar(
      {
        a: "%%_b_%% %%_c_%% %%_d_%% %%_e_%%",
        b: "stringB",
        c: true,
        d: "stringD",
        e: false,
      },
      {
        resolveToBoolIfAnyValuesContainBool: false,
        resolveToFalseIfAnyValuesContainBool: false,
      }
    ),
    {
      a: "stringB  stringD ",
      b: "stringB",
      c: true,
      d: "stringD",
      e: false,
    },
    "01.04"
  );
});

test("02 - Boolean values inserted instead of other values, in whole", () => {
  equal(
    jVar({
      a: "%%_b_%%",
      b: true,
    }),
    {
      a: false,
      b: true,
    },
    "02.01"
  );
  equal(
    jVar(
      {
        a: "%%_b_%%",
        b: true,
      },
      { resolveToFalseIfAnyValuesContainBool: true }
    ),
    {
      a: false,
      b: true,
    },
    "02.02"
  );
  equal(
    jVar(
      {
        a: "%%_b_%%",
        b: true,
      },
      { resolveToFalseIfAnyValuesContainBool: false }
    ),
    {
      a: true,
      b: true,
    },
    "02.03"
  );
});

test("03 - null values inserted into a middle of a string", () => {
  equal(
    jVar({
      a: "%%_b_%% %%_c_%% %%_d_%% %%_e_%%",
      b: "stringB",
      c: null,
      d: "stringD",
      e: null,
    }),
    {
      a: "stringB  stringD ",
      b: "stringB",
      c: null,
      d: "stringD",
      e: null,
    },
    "03"
  );
});

test("04 - null values inserted instead of other values, in whole", () => {
  equal(
    jVar({
      a: "%%_b_%%",
      b: null,
    }),
    {
      a: null,
      b: null,
    },
    "04.01"
  );
  equal(
    jVar({
      a: "  %%_b_%%  ", // <---- will "whole value is var" detection cope with whitespaces?
      b: null,
    }),
    {
      a: null,
      b: null,
    },
    "04.02 - spaces around a value which would resolve to null"
  );
  equal(
    jVar({
      a: "%%-b-%%",
      b: null,
    }),
    {
      a: null,
      b: null,
    },
    "04.03 - using non-wrapping heads/tails"
  );
  equal(
    jVar({
      a: "  %%-b-%%  ",
      b: null,
    }),
    {
      a: null,
      b: null,
    },
    "04.04 - like #3 but with extra whitespace"
  );
  equal(
    jVar(
      {
        a: "%%_b_%%",
        b: null,
      },
      {
        wrapHeadsWith: "{{",
        wrapTailsWith: "}}",
      }
    ),
    {
      a: null,
      b: null,
    },
    "04.05 - doesn't wrap null"
  );
  equal(
    jVar(
      {
        a: "%%-b-%%", // <---- it was no-wrap markers anyway
        b: null,
      },
      {
        wrapHeadsWith: "{{",
        wrapTailsWith: "}}",
      }
    ),
    {
      a: null,
      b: null,
    },
    "04.06 - doesn't wrap null"
  );
});

test.run();
