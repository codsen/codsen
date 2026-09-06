// Quick Take

import { strict as assert } from "node:assert";

import changelogTimeline from "../dist/remark-conventional-commit-changelog-timeline.esm.js";

let input = `
# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.1.0 (2022-08-12)

### Features

- abc
- xyz
`;

let expected = `
<h2>3.1.0</h2>
<div class="release-date">12 Aug <span>2022</span></div>
<h3><span class="emoji">✨</span> Features</h3>
<ul>
  <li>abc</li>
  <li>xyz</li>
</ul>
`;

assert.equal(changelogTimeline(input), expected);
