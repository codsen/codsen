// Add the conventional emoji for each recognised change section

import { strict as assert } from "node:assert";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import timeline from "../dist/remark-conventional-commit-changelog-timeline.esm.js";

const result = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(timeline)
  .use(rehypeStringify)
  .processSync(
    "### Features\n\n### BREAKING CHANGES\n\n### Reverts\n\n### Changes\n\n### Improvements\n\n### Bug Fixes\n",
  ).value;

assert.match(result, /<span class="emoji">✨<\/span> Features/);
assert.match(result, /<span class="emoji">💥<\/span> BREAKING CHANGES/);
assert.match(result, /<span class="emoji">⏪<\/span> Reverts/);
assert.match(result, /<span class="emoji">✈️<\/span> Changes/);
assert.match(result, /<span class="emoji">🏗️<\/span> Improvements/);
assert.match(result, /<span class="emoji">🔧<\/span> Fixed/);
