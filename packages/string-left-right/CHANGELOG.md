# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 6.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 5.1.0 (2022-08-12)

### Features

- export types ([9185b62](https://github.com/codsen/codsen/commit/9185b623f1668d52371847c1432a611fa60d1828))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 5.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 4.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 4.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 4.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 4.0.0 (2021-01-23)

### Features

- rewrite in TS ([7de8464](https://github.com/codsen/codsen/commit/7de846446d511a7d778e63b92c6f10f873388c72))

### BREAKING CHANGES

- there should be no breaking changes but we're bumping _major_ just in case...

## 2.3.0 (2019-09-04)

### Features

- two new methods: rightStopAtNewLines() and leftStopAtNewLines() ([cfb7557](https://gitlab.com/codsen/codsen/commit/cfb7557))

## 2.2.0 (2019-04-06)

### Features

- Case insensitive opts to seqLeft and seqRight ([fafbf19](https://gitlab.com/codsen/codsen/commit/fafbf19))
- Hungry chomp ([fd07afd](https://gitlab.com/codsen/codsen/commit/fd07afd))

## 2.1.5 (2019-03-22)

### Fixed

- Tweak the algorithm and add more unit tests ([1008482](https://gitlab.com/codsen/codsen/commit/1008482))
- Tweak the chompRight algorithm to match two characters repeated vs more ([8403566](https://gitlab.com/codsen/codsen/commit/8403566))

## 2.1.0 (2019-03-17)

### Features

- API tweaks ([2ce37c3](https://gitlab.com/codsen/codsen/commit/2ce37c3))
- chompLeft() ([81e44f0](https://gitlab.com/codsen/codsen/commit/81e44f0))
- chompRight() ([e02a16f](https://gitlab.com/codsen/codsen/commit/e02a16f))
- leftSeq and rightSeq ([f5e075e](https://gitlab.com/codsen/codsen/commit/f5e075e))
- Optional arguments via appended ? character ([90efa04](https://gitlab.com/codsen/codsen/commit/90efa04))

## 1.10.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 1.6.0 (2018-12-26)

- Added `opts.addSingleSpaceToPreventAccidentalConcatenation` ([19b1390](https://gitlab.com/codsen/codsen/tree/master/packages/string-left-right/commits/19b1390))

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
