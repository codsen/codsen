import { strict as assert } from "node:assert";

import { cleanChangelogs } from "../dist/lerna-clean-changelogs.esm.js";

const source = `# Changelog

## [2.0.0](https://example.com/compare/1.0.0...2.0.0)

- Ready

## 1.1.0

- WIP: incomplete
`;
const result = cleanChangelogs(source, { extras: true }).res;

assert.equal(result.includes("## 2.0.0"), true);
assert.equal(result.includes("WIP"), false);
assert.equal(result.includes("## 1.1.0"), false);
