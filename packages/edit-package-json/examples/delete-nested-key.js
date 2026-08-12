// Delete a nested object key

import { strict as assert } from "node:assert";

import { del } from "../dist/edit-package-json.esm.js";

assert.equal(
  del('{"scripts":{"test":"uvu","lint":"biome check ."}}', "scripts.lint"),
  '{"scripts":{"test":"uvu"}}',
);
