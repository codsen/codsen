// Replace an existing nested value with null

import { strict as assert } from "node:assert";

import { set } from "../dist/edit-package-json.esm.js";

assert.equal(
  set('{"release":{"channel":"next"}}', "release.channel", null),
  '{"release":{"channel":null}}',
);
