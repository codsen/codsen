import { strict as assert } from "node:assert";

import { convertAll } from "../dist/string-apostrophes.esm.js";

assert.equal(
  convertAll('She said, "hello."').result,
  "She said, \u201chello.\u201d",
);
