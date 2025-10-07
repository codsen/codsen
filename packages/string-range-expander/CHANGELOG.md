# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 4.0.25 (2025-10-07)

**Note:** Version bump only for package string-range-expander

## 4.0.9 (2023-05-13)

### Bug Fixes

- correct `opts.ifRightSideIncludesThisCropItToo` edge cases ([49bd408](https://github.com/codsen/codsen/commit/49bd4085167116d30f631ffc45388083becf903e))

## 4.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 3.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 3.0.13 (2022-04-18)

### Fixed

- tweak types ([e7b5188](https://github.com/codsen/codsen/commit/e7b518884cc6b8edf3099efb2fc023c8318e938c))

## 3.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 2.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 2.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 2.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 2.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([ea4ccc3](https://github.com/codsen/codsen/commit/ea4ccc38c24614ac2e63538fc5880f10fc255d3e))

### BREAKING CHANGES

- previously: `import expander from ...` - now: `import { expander } from ...`

## 1.12.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.11.0 (2020-04-18)

### Features

- refactor, remove all dependencies (there was only one) ([6e49b8b](https://gitlab.com/codsen/codsen/commit/6e49b8b7c5a031f650f779d68480d91891aea66d))

## 1.10.45 (2019-10-02)

### Performance Improvements

- remove check-types-mini to improve speed by around 500x ([5e219a8](https://gitlab.com/codsen/codsen/commit/5e219a8))

## 1.10.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 1.6.0 (2018-12-26)

### Features

- improvements to `opts.addSingleSpaceToPreventAccidentalConcatenation` ([8bb929a](https://gitlab.com/codsen/codsen/tree/master/packages/string-range-expander/commits/8bb929a))
- `opts.addSingleSpaceToPreventAccidentalConcatenation` ([19b1390](https://gitlab.com/codsen/codsen/tree/master/packages/string-range-expander/commits/19b1390))
- `opts.addSingleSpaceToPreventAccidentalConcatenation` improvements ([47df5be](https://gitlab.com/codsen/codsen/tree/master/packages/string-range-expander/commits/47df5be))

## 1.5.0 (2018-10-26)

- Updated all dependencies
- Restored coveralls.io reporting
- Restored unit test linting

## 1.4.0 (2018-09-20)

- Improvements to `opts.addSingleSpaceToPreventAccidentalConcatenation`, now it detects is there at least one digit or number around and if there's none, it doesn't add a space.

## 1.3.0 (2018-09-20)

- Improvements to cases when `opts.ifLeftSideIncludesThisThenCropTightly`/`opts.ifRightSideIncludesThisThenCropTightly` is an array
- Now we tend an edge case when `opts.addSingleSpaceToPreventAccidentalConcatenation` is surrounded by characters, whitelisted by `opts.ifLeftSideIncludesThisThenCropTightly` and `opts.ifRightSideIncludesThisThenCropTightly` (or just one of them, but then the other is a falsey empty string). In that case, the compensation space is not added.

## 1.2.0 (2018-09-18)

- New feature - `opts.addSingleSpaceToPreventAccidentalConcatenation`. It's off by default but if it's on, it can prevent accidental concatenation of string when chunk is deleted. It checks the outer edges of the string range what is about to be deleted and if non-whitespace surrounds both sides it adds a single space (as range's third argument).

## 1.0.0 (2018-09-11)

- First public release
