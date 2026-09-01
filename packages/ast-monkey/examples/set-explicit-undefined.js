// Set a value to undefined

import { strict as assert } from "node:assert";

import { set } from "../dist/ast-monkey.esm.js";

assert.deepEqual(set({ status: "ready" }, { index: 1, val: undefined }), {
  status: undefined,
});
