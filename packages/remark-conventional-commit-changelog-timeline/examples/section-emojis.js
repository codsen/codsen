// Add the conventional emoji for each recognised change section

import { strict as assert } from "node:assert";

import changelogTimeline from "../dist/remark-conventional-commit-changelog-timeline.esm.js";

const result = changelogTimeline(
  "### Features\n\n### BREAKING CHANGES\n\n### Reverts\n\n### Changes\n\n### Improvements\n\n### Bug Fixes\n",
);

assert.match(result, /<span class="emoji">✨<\/span> Features/);
assert.match(result, /<span class="emoji">💥<\/span> BREAKING CHANGES/);
assert.match(result, /<span class="emoji">⏪<\/span> Reverts/);
assert.match(result, /<span class="emoji">✈️<\/span> Changes/);
assert.match(result, /<span class="emoji">🏗️<\/span> Improvements/);
assert.match(result, /<span class="emoji">🔧<\/span> Fixed/);
