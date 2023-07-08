// Raises alarm if variables file has been wiped

import { strict as assert } from "assert";

import { extractVars } from "../dist/string-extract-sass-vars.esm.js";

assert.throws(() =>
  extractVars("", {
    throwIfEmpty: true,
  }),
);
