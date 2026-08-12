// Uglify names without class or ID prefixes

import { strict as assert } from "node:assert";

import { uglifyArr } from "../dist/string-uglify.esm.js";

const result = uglifyArr(["navigation", "navigation", "footer"]);

assert.equal(result[0], result[1]);
assert.equal(
  result.every((name) => !name.startsWith(".") && !name.startsWith("#")),
  true,
);
