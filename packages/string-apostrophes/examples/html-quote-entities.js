// Convert the quotes into HTML entities

import { strict as assert } from "node:assert";

import { convertAll } from "../dist/string-apostrophes.esm.js";

assert.equal(
  convertAll('She said, "hello."', { convertEntities: true }).result,
  "She said, &ldquo;hello.&rdquo;",
);
