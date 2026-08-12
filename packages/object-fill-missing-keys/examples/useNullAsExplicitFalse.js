// `opts.useNullAsExplicitFalse`

import { strict as assert } from "node:assert";

import { fillMissing } from "../dist/object-fill-missing-keys.esm.js";

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
    },
  ),
  {
    // result
    a: null,
  },
);
