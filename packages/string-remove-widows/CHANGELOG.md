# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.6.12](https://gitlab.com/codsen/codsen/compare/string-remove-widows@1.6.11...string-remove-widows@1.6.12) (2020-08-23)

**Note:** Version bump only for package string-remove-widows





## 1.6.0 (2020-04-26)

### Features

- harden the linting rules set and rebase a little ([2988292](https://gitlab.com/codsen/codsen/commit/29882925c521853f4458112b72669ec8b2a0cb5b))

## 1.5.2 (2019-10-21)

### Bug Fixes

- remove rogue require() which was present instead of import ([233a8d1](https://gitlab.com/codsen/codsen/commit/233a8d11d70f62c7a521e97207acfdb3b64d5f63))

## 1.5.0 (2019-10-02)

### Bug Fixes

- fix a case where nbsp could be replaced with itself ([7ca664a](https://gitlab.com/codsen/codsen/commit/7ca664a))

### Features

- reporting res.whatWasDone - widow removal, decoding or both or neither ([630a08d](https://gitlab.com/codsen/codsen/commit/630a08d))

## 1.4.0 (2019-09-11)

### Bug Fixes

- properly recognise single line breaks, not counts are reset correctly ([ec5578b](https://gitlab.com/codsen/codsen/commit/ec5578b))

### Features

- add opts.ignore option "all" ([a02dc78](https://gitlab.com/codsen/codsen/commit/a02dc78))
- improvements to the algorithm ([8a37c1d](https://gitlab.com/codsen/codsen/commit/8a37c1d))

## 1.3.0 (2019-09-04)

### Features

- add opts.tagRanges ([662bd6e](https://gitlab.com/codsen/codsen/commit/662bd6e))

## 1.2.0 (2019-08-18)

### Bug Fixes

- disable min char count setting so it's off by default ([60aa23c](https://gitlab.com/codsen/codsen/commit/60aa23c))
- further twaks to m-dash rules ([bec2683](https://gitlab.com/codsen/codsen/commit/bec2683))

### Features

- enforce that nbsp's in front of dashes would be added only if whitespace follows that dash ([9b23232](https://gitlab.com/codsen/codsen/commit/9b23232))

## 1.1.0 (2019-08-08)

### Features

- init ([29000b2](https://gitlab.com/codsen/codsen/commit/29000b2))
- opts.reportProgressFuncFrom and opts.reportProgressFuncTo ([751c8d7](https://gitlab.com/codsen/codsen/commit/751c8d7))

## 1.0.0 (2019-08-07)

- ✨ First public release
