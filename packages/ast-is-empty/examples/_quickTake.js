// Quick Take

import { strict as assert } from "node:assert";

import { isEmpty } from "../dist/ast-is-empty.esm.js";

assert.equal(
  isEmpty({
    a: "",
  }),
  true,
);
