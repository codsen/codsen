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
    "01.01 - false - default (opts on)"
  );
  equal(
    jVar(
      {
        a: "zzz %%_b_%% zzz",
        b: false,
      },
      {
        resolveToBoolIfAnyValuesContainBool: true,
      }
    ),
    {
      a: false,
      b: false,
    },
    "01.02 - false - hardcoded (opts on)"
  );
  equal(
    jVar(
      {
        a: "zzz %%_b_%% zzz",
        b: false,
      },
      {
        resolveToBoolIfAnyValuesContainBool: false,
      }
    ),
    {
      a: "zzz  zzz",
      b: false,
    },
    "01.03 - false - opts off"
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
      }
    ),
    {
      a: true, // because first encountered value to be resolved was Boolean True
      b: true,
      c: false,
    },
    "01.04 - relying on default, opts.resolveToFalseIfAnyValuesContainBool does not matter"
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
      }
    ),
    {
      a: true,
      b: true,
      c: false,
    },
    "01.05 - Bools hardcoded default, not forcing false"
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
      }
    ),
    {
      a: false,
      b: true,
      c: false,
    },
    "01.06 - Bools hardcoded default, forcing false"
  );
});

test.run();
