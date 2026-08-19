// List all declarations in the source

import { strict as assert } from "node:assert";

import { extract } from "../dist/tsd-extract.esm.js";

const source = `interface First { value: string }
interface Second { count: number }`;

assert.deepEqual(extract(source, "Second", { extractAll: true }).all, [
  "First",
  "Second",
]);
