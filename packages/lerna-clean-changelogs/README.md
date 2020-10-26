# lerna-clean-changelogs

> Removes frivolous entries from commitizen generated changelogs

<div class="package-badges">
  <a href="https://www.npmjs.com/package/lerna-clean-changelogs" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/lerna-clean-changelogs" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/lerna-clean-changelogs" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/lerna-clean-changelogs?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/lerna-clean-changelogs.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i lerna-clean-changelogs
```

## Quick Take

```js
import { strict as assert } from "assert";
import cleanChangelogs from "lerna-clean-changelogs";

// are all values equal to null:
assert.deepEqual(
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

`),
  //
  //
  //
  // output:
  {
    version: "1.3.59",
    res: `# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 2.9.0 (2018-12-26)

### Bug Fixes

- aaa

### Features

- bbb
`,
  }
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/lerna-clean-changelogs/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
