# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 4.0.1 (2021-01-28)


### Bug Fixes

* add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))





# 4.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([ceaa25f](https://github.com/codsen/codsen/commit/ceaa25fb4f11a159dd0aa369a8f29461d884b42d))

### BREAKING CHANGES

- previously you'd consume like: `import groupStr from ..." - now `import { groupStr } from ..."

## 3.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.1.27 (2019-12-14)

### Bug Fixes

- fix the regression of letters in front of digits not causing a bailout ([d141967](https://gitlab.com/codsen/codsen/commit/d14196750fa3b83d049bbd573fe0851ef150120f))

## 2.1.0 (2019-06-29)

### Features

- Add perf measurement, recording and historic comparison ([83b2bee](https://gitlab.com/codsen/codsen/commit/83b2bee))
- Perf improvements due to more relaxed API - now skips excessive input arg validations ([a50e46f](https://gitlab.com/codsen/codsen/commit/a50e46f))

## 1.3.0 (2018-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.1.0 (2018-12-14)

- ✨ Restore ava linting
- ✨ General setup refresh

## 1.0.0 (2018-10-11)

- ✨ Initial release
