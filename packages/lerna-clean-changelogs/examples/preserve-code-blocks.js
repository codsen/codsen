// Keep literal examples while removing unfinished changelog entries.

import { strict as assert } from "node:assert";

import { cleanChangelogs } from "../dist/lerna-clean-changelogs.esm.js";

const source = `# Changelog

## 1.0.0

- WIP: unfinished change

\`\`\`md
**Note:** Version bump only for package example
* WIP: literal example
\`\`\`
`;

assert.equal(
  cleanChangelogs(source, { extras: true }).res,
  source.replace("- WIP: unfinished change\n\n", ""),
);
