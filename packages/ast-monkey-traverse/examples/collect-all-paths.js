// Collect the path of every visited node

import { strict as assert } from "node:assert";

import { traverse } from "../dist/ast-monkey-traverse.esm.js";

const paths = [];

traverse({ a: "1", b: { c: "2" } }, (key, value, metadata) => {
  paths.push(metadata.path);
  return value === undefined ? key : value;
});

assert.deepEqual(paths, ["a", "b", "b.c"]);
