// An option to not fill the paths if they contain placeholders

import { strict as assert } from "assert";

import { fillMissing } from "../dist/object-fill-missing-keys.esm.js";

assert.deepEqual(
  fillMissing(
    {
      // input object
      a: {
        b: false, // <---- we don't want to automatically normalise this key
        x: "x",
      },
      z: "z",
    },
    {
      // reference schema object
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
      doNotFillThesePathsIfTheyContainPlaceholders: ["a.b"],
    }
  ),
  {
    a: {
      b: false, // <---
      x: "x",
    },
    z: "z",
  }
);
