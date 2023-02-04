# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.7](https://github.com/codsen/codsen/compare/string-remove-widows@4.0.6...string-remove-widows@4.0.7) (2023-02-04)

**Note:** Version bump only for package string-remove-widows

## 4.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 3.1.0 (2022-08-12)

### Features

- export types ([9d2e8ad](https://github.com/codsen/codsen/commit/9d2e8ad18fbac2478fca6d261a5fa8451f3a85f7))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 3.0.17 (2022-04-18)

### Fixed

- tweak types ([0aee2bd](https://github.com/codsen/codsen/commit/0aee2bdf4ce7fc7357c56b8a281630c4542c9791))

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

- rewrite in TS, fix a typo ([00475af](https://github.com/codsen/codsen/commit/00475af4accebc91d16e525951201ca0c45c2056))

### BREAKING CHANGES

- output object's `log.timeTakenInMiliseconds` had a typo, "l" missing, it's now `log.timeTakenInMilliseconds`

## 1.7.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.6.0 (2020-04-26)

### Features

- harden the linting rules set and rebase a little ([2988292](https://gitlab.com/codsen/codsen/commit/29882925c521853f4458112b72669ec8b2a0cb5b))

## 1.5.2 (2019-10-21)

### Fixed

- remove rogue `require()` which was present instead of import ([233a8d1](https://gitlab.com/codsen/codsen/commit/233a8d11d70f62c7a521e97207acfdb3b64d5f63))

## 1.5.0 (2019-10-02)

### Fixed

- fix a case where nbsp could be replaced with itself ([7ca664a](https://gitlab.com/codsen/codsen/commit/7ca664a))

### Features

- reporting `res.whatWasDone` - widow removal, decoding or both or neither ([630a08d](https://gitlab.com/codsen/codsen/commit/630a08d))

## 1.4.0 (2019-09-11)

### Fixed

- properly recognise single line breaks, not counts are reset correctly ([ec5578b](https://gitlab.com/codsen/codsen/commit/ec5578b))

### Features

- add `opts.ignore` option "all" ([a02dc78](https://gitlab.com/codsen/codsen/commit/a02dc78))
- improvements to the algorithm ([8a37c1d](https://gitlab.com/codsen/codsen/commit/8a37c1d))

## 1.3.0 (2019-09-04)

### Features

- add `opts.tagRanges` ([662bd6e](https://gitlab.com/codsen/codsen/commit/662bd6e))

## 1.2.0 (2019-08-18)

### Fixed

- disable min char count setting so it's off by default ([60aa23c](https://gitlab.com/codsen/codsen/commit/60aa23c))
- further tweaks to m-dash rules ([bec2683](https://gitlab.com/codsen/codsen/commit/bec2683))

### Features

- enforce that `nbsp`'s in front of dashes would be added only if whitespace follows that dash ([9b23232](https://gitlab.com/codsen/codsen/commit/9b23232))

## 1.1.0 (2019-08-08)

### Features

- init ([29000b2](https://gitlab.com/codsen/codsen/commit/29000b2))
- `opts.reportProgressFuncFrom` and `opts.reportProgressFuncTo` ([751c8d7](https://gitlab.com/codsen/codsen/commit/751c8d7))

## 1.0.0 (2019-08-07)

- First public release
