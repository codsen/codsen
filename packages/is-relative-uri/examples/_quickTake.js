// Quick Take

import { strict as assert } from "assert";

import { isRel } from "../dist/is-relative-uri.esm.js";

assert.deepEqual(isRel(".../resource.txt"), {
  res: false,
  message: "Three consecutive dots.",
});
