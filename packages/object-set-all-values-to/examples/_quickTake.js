

// Quick Take

import { strict as assert } from "assert";
import setAllValuesTo from "../dist/object-set-all-values-to.esm.js";

assert.deepEqual(
  setAllValuesTo({
    a: "a",
    b: "b",
    c: "c",
    d: "d",
  }),
  {
    a: false,
    b: false,
    c: false,
    d: false,
  }
);

// you can change the default "false" to something else:
assert.deepEqual(
  setAllValuesTo(
    {
      a: "a",
      b: "b",
      c: "c",
      d: "d",
    },
    "x"
  ),
  {
    a: "x",
    b: "x",
    c: "x",
    d: "x",
  }
);
