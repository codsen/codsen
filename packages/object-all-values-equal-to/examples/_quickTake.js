// Quick Take

import { strict as assert } from "assert";
import { allEq } from "../dist/object-all-values-equal-to.esm.js";

// are all values equal to null:
assert.equal(allEq({ a: null, c: null }, null), true);
// yes

// are all values equal to "false":
assert.equal(allEq({ a: false, c: "zzz" }, false), false);
// no

// are all values equal to "false"?
assert.equal(
  allEq(
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
