// Quick Take

import { strict as assert } from "assert";

import { mergeAdvanced } from "../dist/object-merge-advanced.esm.js";

assert.deepEqual(
  mergeAdvanced(
    {
      a: ["c"],
      m: "n",
    },
    {
      a: "b",
      k: "l",
    },
    {
      ignoreKeys: ["a"],
    }
  ),
  {
    a: ["c"],
    k: "l",
    m: "n",
  }
);
