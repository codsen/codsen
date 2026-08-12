// Hold selected keys constant while varying the others

import { strict as assert } from "node:assert";

import { combinations } from "../dist/object-boolean-combinations.esm.js";

assert.deepEqual(
  combinations(
    { cache: false, compress: false, sourceMap: false },
    { compress: true },
  ),
  [
    { cache: false, sourceMap: false, compress: true },
    { cache: true, sourceMap: false, compress: true },
    { cache: false, sourceMap: true, compress: true },
    { cache: true, sourceMap: true, compress: true },
  ],
);
