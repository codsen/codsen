// Using placeholder to cause the value population

import { strict as assert } from "assert";

import { fillMissing } from "../dist/object-fill-missing-keys.esm.js";

assert.deepEqual(
  fillMissing(
    {
      // object we work upon
      a: {
        b: true, // <-- not placeholder but lower in data hierarchy (boolean)
        x: "x",
      },
      z: "z",
    },
    {
      // reference (schema) object
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
    },
  ),
  {
    a: {
      b: {
        c: false, // <---- values added!
        d: false, // <---- values added!
      },
      x: "x",
    },
    z: "z",
  },
);
