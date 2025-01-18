# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.11](https://github.com/codsen/codsen/compare/string-overlap-one-on-another@4.0.10...string-overlap-one-on-another@4.0.11) (2025-01-18)

**Note:** Version bump only for package string-overlap-one-on-another

## 4.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 3.2.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 3.1.1 (2022-04-18)

### Fixed

- tweak types ([6e47b9e](https://github.com/codsen/codsen/commit/6e47b9eb3cd6592c87658e50206241400fca9bcc))

## 3.1.0 (2022-04-10)

### Features

- export defaults ([97f5e9b](https://github.com/codsen/codsen/commit/97f5e9bf868646abe475f68c07634c6d3041af38))

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

- rewrite in TS, start using named exports ([84f205e](https://github.com/codsen/codsen/commit/84f205ebc7a85c657d68dbb3c850de3bb59876e8))

### BREAKING CHANGES

- previously you'd consume like: `import overlap from ...` - now: `import { overlap } from ...`

## 1.6.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.5.45 (2019-10-05)

### Performance Improvements

- remove check-types-mini ([faed1ea](https://gitlab.com/codsen/codsen/commit/faed1ea))

## 1.5.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 1.1.0 (2018-10-26)

- Updated all dependencies
- Restored coveralls.io reporting
- Restored unit test linting

## 1.0.0 (2018-08-15)

- First public release
