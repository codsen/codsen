// Abort an asynchronous search

import { strict as assert } from "node:assert";

import { glob } from "../dist/codsen-glob.esm.js";

const controller = new AbortController();
controller.abort();

await assert.rejects(
  glob("**/*.ts", { signal: controller.signal }),
  (error) => error.name === "AbortError",
);
