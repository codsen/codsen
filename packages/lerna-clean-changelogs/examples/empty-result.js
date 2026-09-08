// Empty cleaned text is a valid result; retain an existing EOF newline.

import { strict as assert } from "node:assert";

import { cleanChangelogs } from "../dist/lerna-clean-changelogs.esm.js";

const source = "## 1.0.0\n\n**Note:** Version bump only for package example";

assert.equal(cleanChangelogs(source).res, "");
assert.equal(cleanChangelogs(`${source}\n`).res, "\n");
