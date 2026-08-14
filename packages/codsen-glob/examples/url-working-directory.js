// Use a file URL as the working directory

import { strict as assert } from "node:assert";
import { pathToFileURL } from "node:url";

import { glob } from "../dist/codsen-glob.esm.js";

assert.deepEqual(
  await glob("src/*.ts", { cwd: pathToFileURL(process.cwd()) }),
  ["src/main.ts"],
);
