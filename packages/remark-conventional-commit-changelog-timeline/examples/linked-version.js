// Convert a linked release heading into timeline markup

import { strict as assert } from "node:assert";

import changelogTimeline from "../dist/remark-conventional-commit-changelog-timeline.esm.js";

const result = changelogTimeline(
  "# [2.0.0](https://example.com/releases/2.0.0) (2024-03-05)\n",
);

assert.equal(
  result,
  `
<h2>2.0.0</h2>
<div class="release-date">5 Mar <span>2024</span></div>
`,
);
