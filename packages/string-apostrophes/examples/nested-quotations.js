import { strict as assert } from "node:assert";

import { convertAll } from "../dist/string-apostrophes.esm.js";

assert.equal(
  convertAll(`She said, "Call it 'alpha'."`).result,
  "She said, \u201cCall it \u2018alpha\u2019.\u201d",
);
