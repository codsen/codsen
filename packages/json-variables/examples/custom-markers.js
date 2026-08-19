// Use custom variable markers

import { strict as assert } from "node:assert";

import { jVar } from "../dist/json-variables.esm.js";

assert.deepEqual(
  jVar(
    { greeting: "Hello, {{ name }}", name: "Ada" },
    { heads: "{{", tails: "}}" },
  ),
  { greeting: "Hello, Ada", name: "Ada" },
);
