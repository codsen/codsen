// Quick Take

import { strict as assert } from "assert";
import { find } from "../dist/ast-monkey.esm.js";

assert.deepEqual(
  find(
    {
      a1: {
        b1: "c1",
      },
      a2: {
        b2: "c2",
      },
      z1: {
        x1: "y1",
      },
    },
    { key: "a*" }
  ),
  [
    {
      index: 1,
      key: "a1",
      val: {
        b1: "c1",
      },
      path: [1],
    },
    {
      index: 3,
      key: "a2",
      val: {
        b2: "c2",
      },
      path: [3],
    },
  ]
);
