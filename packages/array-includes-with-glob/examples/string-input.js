// Match a glob against a single string

import { strict as assert } from "node:assert";

import { includesWithGlob } from "../dist/array-includes-with-glob.esm.js";

assert.equal(includesWithGlob("src/main.ts", "src/*.ts"), true);
