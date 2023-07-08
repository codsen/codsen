// Quick Take

import { strict as assert } from "assert";

import { flattenReferencing } from "../dist/object-flatten-referencing.esm.js";

assert.deepEqual(
  flattenReferencing(
    {
      key1: "val11.val12",
      key2: "val21.val22",
    },
    {
      key1: "Contact us",
      key2: "Tel. 0123456789",
    },
  ),
  {
    key1: "%%_val11.val12_%%",
    key2: "%%_val21.val22_%%",
  },
);
