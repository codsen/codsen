/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import allEqualTo from "../dist/object-all-values-equal-to.esm.js";

// are all values equal to null:
assert.equal(allEqualTo({ a: null, c: null }, null), true);
// yes

// are all values equal to "false":
assert.equal(allEqualTo({ a: false, c: "zzz" }, false), false);
// no

// are all values equal to "false"?
assert.equal(
  allEqualTo(
    {
      a: {
        b: false,
        c: [
          {
            d: false,
            e: false,
          },
          {
            g: false,
          },
        ],
      },
      c: false,
    },
    false // reference value to check
  ),
  true // answer is, yes
);
