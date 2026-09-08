// Retain a release heading while published changes remain beneath it.

import { strict as assert } from "node:assert";

import { cleanChangelogs } from "../dist/lerna-clean-changelogs.esm.js";

const source = `# Changelog

## 1.0.0

- WIP: unfinished change
- Published fix
`;

assert.equal(
  cleanChangelogs(source, { extras: true }).res,
  `# Changelog

## 1.0.0

- Published fix
`,
);
