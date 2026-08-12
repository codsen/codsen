// Invalid URI characters

import { strict as assert } from "node:assert";

import { isRel } from "../dist/is-relative-uri.esm.js";

assert.deepEqual(isRel("images/my logo.svg"), {
  res: false,
  message: "Remove whitespace.",
});
