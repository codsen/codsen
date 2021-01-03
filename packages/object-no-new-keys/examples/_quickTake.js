

// Quick Take

import { strict as assert } from "assert";
import nnk from "../dist/object-no-new-keys.esm.js";

assert.deepEqual(
  nnk(
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
