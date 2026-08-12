// Keep semicolons that occur inside a quoted value

import { strict as assert } from "node:assert";

import { extractVars } from "../dist/string-extract-sass-vars.esm.js";

assert.deepEqual(extractVars('$message: "ready; set; go";'), {
  message: "ready; set; go",
});
