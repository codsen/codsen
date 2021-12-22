// Quick Take

import { strict as assert } from "assert";

import { noNewKeys } from "../dist/object-no-new-keys.esm.js";

assert.deepEqual(
  noNewKeys(
    {
      a: {
        b: "b",
        c: "c",
      },
      x: "y",
    },
    {
      a: {
        c: "z",
      },
    }
  ),
  ["a.b", "x"]
);
