// Skip wrapping using alternative markers

import { strict as assert } from "node:assert";

import { jVar } from "../dist/json-variables.esm.js";

assert.deepEqual(
  jVar(
    {
      wrapped: "%%_name_%%",
      unwrapped: "%%-name-%%",
      name: "Ada",
    },
    { wrapHeadsWith: "{{", wrapTailsWith: "}}" },
  ),
  { wrapped: "{{Ada}}", unwrapped: "Ada", name: "Ada" },
);
