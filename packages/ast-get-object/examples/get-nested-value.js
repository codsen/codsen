// Match an object by a nested value

import { strict as assert } from "node:assert";

import { getObj } from "../dist/ast-get-object.esm.js";

assert.deepEqual(
  getObj(
    [
      { type: "page", meta: { author: "Ada", draft: false } },
      { type: "page", meta: { author: "Grace", draft: true } },
    ],
    { meta: { author: "Ada" } },
  ),
  [{ type: "page", meta: { author: "Ada", draft: false } }],
);
