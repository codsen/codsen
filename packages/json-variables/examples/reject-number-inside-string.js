// Reject a number inserted into a string

import { strict as assert } from "node:assert";

import { jVar } from "../dist/json-variables.esm.js";

assert.throws(
  () =>
    jVar(
      { message: "Count: %%_count_%% items", count: 2 },
      { throwWhenNonStringInsertedInString: true },
    ),
  /THROW_ID_04/,
);
