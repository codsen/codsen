// Iterate the result of multiple replacements

import { strict as assert } from "node:assert";

import { rIterate } from "../dist/ranges-iterate.esm.js";

const characters = [];
rIterate(
  "abcdef",
  [
    [1, 2, "X"],
    [4, 5, "Y"],
  ],
  ({ val }) => characters.push(val),
);

assert.equal(characters.join(""), "aXcdYf");
