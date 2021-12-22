// Quick Take

import { strict as assert } from "assert";

import { cleanChangelogs } from "../dist/lerna-clean-changelogs.esm.js";

// are all values equal to null:
assert.equal(
  cleanChangelogs(`# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 2.9.2 (2018-12-27)







**Note:** Version bump only for package ranges-apply



## [2.9.1](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/compare/ranges-apply@2.9.0...ranges-apply@2.9.1) (2018-12-27)

**Note:** Version bump only for package ranges-apply

## 2.9.0 (2018-12-26)

### Bug Fixes

* aaa

### Features

* bbb

`).res,
  //
  //
  //
  // output:
  `# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 2.9.0 (2018-12-26)

### Bug Fixes

- aaa

### Features

- bbb
`
);
