// Quick Take

import { strict as assert } from "assert";
import { combinations } from "../dist/object-boolean-combinations.esm.js";

assert.deepEqual(
  combinations({
    a: true,
    b: false,
    c: true,
  }),
  [
    { a: false, b: false, c: false },
    { a: true, b: false, c: false },
    { a: false, b: true, c: false },
    { a: true, b: true, c: false },
    { a: false, b: false, c: true },
    { a: true, b: false, c: true },
    { a: false, b: true, c: true },
    { a: true, b: true, c: true },
  ]
);
// you get 2^n plain objects in an array
