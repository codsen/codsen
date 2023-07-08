/* eslint no-template-curly-in-string: 0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { jVar } from "../dist/json-variables.esm.js";

test("01 - opts.resolveToBoolIfAnyValuesContainBool, Bools and Strings mix", () => {
  // False

  equal(
    jVar({
      a: "zzz %%_b_%% zzz",
      b: false,
    }),
    {
      a: false,
      b: false,
    },
    "01.01",
  );
  equal(
    jVar(
      {
        a: "zzz %%_b_%% zzz",
        b: false,
      },
      {
        resolveToBoolIfAnyValuesContainBool: true,
      },
    ),
    {
      a: false,
      b: false,
    },
    "01.02",
  );
  equal(
    jVar(
      {
        a: "zzz %%_b_%% zzz",
        b: false,
      },
      {
        resolveToBoolIfAnyValuesContainBool: false,
      },
    ),
    {
      a: "zzz  zzz",
      b: false,
    },
    "01.03",
  );

  // True

  equal(
    jVar(
      {
        a: "zzz %%_b_%% zzz %%_c_%%",
        b: true,
        c: false,
      },
      {
        resolveToFalseIfAnyValuesContainBool: false,
      },
    ),
    {
      a: true, // because first encountered value to be resolved was Boolean True
      b: true,
      c: false,
    },
    "01.04",
  );
  equal(
    jVar(
      {
        a: "zzz %%_b_%% zzz %%_c_%%",
        b: true,
        c: false,
      },
      {
        resolveToBoolIfAnyValuesContainBool: true,
        resolveToFalseIfAnyValuesContainBool: false,
      },
    ),
    {
      a: true,
      b: true,
      c: false,
    },
    "01.05",
  );
  equal(
    jVar(
      {
        a: "zzz %%_b_%% zzz %%_c_%%",
        b: true,
        c: false,
      },
      {
        resolveToBoolIfAnyValuesContainBool: true,
        resolveToFalseIfAnyValuesContainBool: true,
      },
    ),
    {
      a: false,
      b: true,
      c: false,
    },
    "01.06",
  );
});

test.run();
