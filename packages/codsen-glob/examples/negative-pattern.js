// Exclude matches with a negative pattern

import { strict as assert } from "node:assert";

import { glob } from "../dist/codsen-glob.esm.js";

assert.deepEqual(await glob(["*.md", "!CHANGELOG.md"]), ["README.md"]);
