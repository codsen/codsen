// Return directories

import { strict as assert } from "node:assert";

import { glob } from "../dist/codsen-glob.esm.js";

assert.deepEqual(await glob("s*", { onlyDirectories: true }), ["src"]);

assert.equal(
  (await glob("src", { expandDirectories: false, onlyFiles: false }))[0],
  "src",
);
