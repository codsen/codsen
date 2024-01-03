<h1 align="center">lerna-clean-changelogs</h1>

<p align="center">Removes frivolous entries from commitizen generated changelogs</p>

<p align="center">
  <a href="https://codsen.com/os/lerna-clean-changelogs" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/lerna-clean-changelogs" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/lerna-clean-changelogs" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/lerna-clean-changelogs?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/lerna-clean-changelogs.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/lerna-clean-changelogs/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 2.1.0 (`npm i lerna-clean-changelogs@2.1.0`).

```bash
npm i lerna-clean-changelogs
```

## Quick Take

```js
import { strict as assert } from "assert";

import { cleanChangelogs } from "lerna-clean-changelogs";

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
`,
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/lerna-clean-changelogs/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2024 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
