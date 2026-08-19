// Strip the `as` aliases from an export

import { strict as assert } from "node:assert";

import { extract } from "../dist/tsd-extract.esm.js";

const source = "export { original as publicName, unchanged };";

assert.equal(
  extract(source, "export", { stripAs: true }).content,
  "{ publicName, unchanged };",
);
