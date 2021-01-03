/* eslint no-template-curly-in-string: 0 */

import tap from "tap";
import { jVar } from "../dist/json-variables.esm";

tap.test(
  "01 - opts.resolveToBoolIfAnyValuesContainBool, Bools and Strings mix",
  (t) => {
    // False

    t.strictSame(
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
    t.strictSame(
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
    t.strictSame(
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

    t.strictSame(
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
    t.strictSame(
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
    t.strictSame(
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
    t.end();
  }
);
