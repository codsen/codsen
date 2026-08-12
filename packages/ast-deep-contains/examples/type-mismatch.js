// Handle inputs with different container types

import { strict as assert } from "node:assert";

import { deepContains } from "../dist/ast-deep-contains.esm.js";

let errorMessage = "";

deepContains(
  [],
  {},
  () => {},
  (message) => {
    errorMessage = message;
  },
);

assert.match(errorMessage, /first input arg is of a type array/u);
assert.match(errorMessage, /second is object/u);
