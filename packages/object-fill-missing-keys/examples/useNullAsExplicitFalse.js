/* eslint import/extensions:0 */

// `opts.useNullAsExplicitFalse`

import { strict as assert } from "assert";
import fillMissing from "../dist/object-fill-missing-keys.esm.js";

// on
assert.deepEqual(
  fillMissing(
    {
      // object we're working on
      a: null,
    },
    {
      // reference schema
      a: ["z"],
    },
    {
      // options
      useNullAsExplicitFalse: true, // <--- !
    }
  ),
  {
    // result
    a: null,
  }
);

// off
assert.deepEqual(
  fillMissing(
    {
      // object we're working on
      a: null,
    },
    {
      // reference schema
      a: ["z"],
    },
    {
      // options
      useNullAsExplicitFalse: false, // <--- !
    }
  ),
  {
    // result
    a: ["z"],
  }
);
