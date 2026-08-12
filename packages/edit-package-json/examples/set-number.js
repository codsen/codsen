// Set a numeric value without changing surrounding formatting

import { strict as assert } from "node:assert";

import { set } from "../dist/edit-package-json.esm.js";

assert.equal(
  set('{\n  "name": "demo",\n  "retries": 1\n}', "retries", 3),
  '{\n  "name": "demo",\n  "retries": 3\n}',
);
