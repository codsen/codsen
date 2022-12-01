# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 6.0.0 (2022-12-01)

### Features

- drop Node v12 support; minimum version requirement now is v14.18 and above ([c8049e8](https://github.com/codsen/codsen/commit/c8049e82a5844d3f72587740f1cc74e3c9020d22))

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

# 5.2.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

# 5.1.0 (2022-04-10)

### Features

- export defaults ([535dc16](https://github.com/codsen/codsen/commit/535dc169a3083da1768cfbee7b1dfb92051f7333))

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

- rewrite in TS, start using named exports ([ceaa25f](https://github.com/codsen/codsen/commit/ceaa25fb4f11a159dd0aa369a8f29461d884b42d))

### BREAKING CHANGES

- previously you'd consume like: `import groupStr from ..." - now `import { groupStr } from ..."

## 3.0.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 2.1.27 (2019-12-14)

### Fixed

- fix the regression of letters in front of digits not causing a bailout ([d141967](https://gitlab.com/codsen/codsen/commit/d14196750fa3b83d049bbd573fe0851ef150120f))

## 2.1.0 (2019-06-29)

### Features

- Add perf measurement, recording and historic comparison ([83b2bee](https://gitlab.com/codsen/codsen/commit/83b2bee))
- Perf improvements due to more relaxed API - now skips excessive input arg validations ([a50e46f](https://gitlab.com/codsen/codsen/commit/a50e46f))

## 1.3.0 (2018-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 1.1.0 (2018-12-14)

- Restore ava linting
- General setup refresh

## 1.0.0 (2018-10-11)

- Initial release
