/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import fillMissing from "../dist/object-fill-missing-keys.esm.js";

// deleting key 'c', with value 'd'
assert.deepEqual(
  fillMissing(
    {
      // input object that could have came from JSON
      b: "b",
    },
    {
      // schema reference object
      a: false,
      b: false,
      c: false,
    }
  ),
  {
    // patched result
    a: false,
    b: "b",
    c: false,
  }
);
