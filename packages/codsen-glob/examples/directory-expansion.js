// Configure directory expansion

import { strict as assert } from "node:assert";

import { glob } from "../dist/codsen-glob.esm.js";

assert.deepEqual(
  await glob("src", {
    expandDirectories: { files: ["main.ts"], extensions: ["ts"] },
  }),
  ["src/main.ts"],
);
