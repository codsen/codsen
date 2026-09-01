// Find explicit undefined values

import { strict as assert } from "node:assert";

import { find } from "../dist/ast-monkey.esm.js";

assert.deepEqual(
  find([undefined, "present"], {
    criteria: { kind: "value", value: undefined },
  }),
  [{ index: 1, key: undefined, val: undefined, path: [1] }],
);
