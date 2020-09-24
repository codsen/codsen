/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import looseCompare from "../dist/ast-loose-compare.esm.js";

assert.equal(
  looseCompare(
    {
      a: {
        b: "d",
        c: [],
        e: "f",
        g: "h",
      },
    },
    {
      a: {
        b: "d",
        c: [],
      },
    }
  ),
  true
);
