// Replace an object value while preserving outer formatting

import { strict as assert } from "node:assert";

import { set } from "../dist/edit-package-json.esm.js";

assert.equal(
  set('{\n  "name": "demo",\n  "publishConfig": {}\n}', "publishConfig", {
    access: "public",
  }),
  '{\n  "name": "demo",\n  "publishConfig": {"access":"public"}\n}',
);
