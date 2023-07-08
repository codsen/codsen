// Truncation upon request, to minimize the object footprint

import { strict as assert } from "assert";

import { fillMissing } from "../dist/object-fill-missing-keys.esm.js";

assert.deepEqual(
  fillMissing(
    {
      // input object
      a: {
        b: {
          // this object in "b"'s value will be removed and set to placeholder "false"
          c: false,
          d: false,
        },
        x: {
          // this too
          y: false,
        },
      },
      z: "z",
    },
    {
      // schema object
      a: {
        b: {
          c: false,
          d: false,
        },
        x: false,
      },
      z: false,
    },
    {
      // settings
      doNotFillThesePathsIfTheyContainPlaceholders: ["lalala", "a.b", "a.x"],
    },
  ),
  {
    // result
    a: {
      b: false,
      x: false,
    },
    z: "z",
  },
);
