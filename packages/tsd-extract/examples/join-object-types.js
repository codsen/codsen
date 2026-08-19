// Join two object types into one

import { strict as assert } from "node:assert";

import { join } from "../dist/tsd-extract.esm.js";

assert.equal(
  join(
    "interface Identity { id: string; }",
    "type Timestamps = { updated: Date; }",
  ),
  "{\n  id: string;\n  updated: Date;\n}",
);
