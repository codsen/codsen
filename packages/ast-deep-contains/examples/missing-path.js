// Handle a path that is absent from the reference tree

import { strict as assert } from "node:assert";

import { deepContains } from "../dist/ast-deep-contains.esm.js";

const errors = [];

deepContains(
  { title: "Release notes" },
  { title: "Release notes", author: "Ada" },
  () => {},
  (message) => errors.push(message),
);

assert.equal(errors.length, 1);
assert.match(errors[0], /does not have the path "author"/u);
