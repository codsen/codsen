// Flatten an object's keys and values to strings

import { strict as assert } from "node:assert";

import { flattenObject } from "../dist/object-flatten-referencing.esm.js";

assert.deepEqual(flattenObject({ name: "Ada", roles: ["author", "editor"] }), [
  "name.Ada",
  "roles.author",
  "roles.editor",
]);
