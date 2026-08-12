import { strict as assert } from "node:assert";

import { extract } from "../dist/tsd-extract.esm.js";

const source = `export { first } from "one";
export { second } from "two";`;

assert.equal(
  extract(source, "export", { mustInclude: "second" }).value,
  'export { second } from "two";',
);
