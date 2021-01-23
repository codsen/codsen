# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))
* fix the regression of letters in front of digits not causing a bailout ([42df562](https://github.com/codsen/codsen/commit/42df56214564cf7c48653c6ec78d1a578b53980c))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* Add perf measurement, recording and historic comparison ([a139788](https://github.com/codsen/codsen/commit/a13978859821c5c47f5e391cb637a1587602c6f4))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* Merge modes via opts.mergeType ([2394464](https://github.com/codsen/codsen/commit/2394464976ce1970bcd31b45d9fd9955f4bbcc09))
* Perf improvements due to more relaxed API - now skips excessive input arg validations ([f3efab9](https://github.com/codsen/codsen/commit/f3efab985936fea1c3119a01d8024190541c8f56))
* rewrite in TS, start using named exports ([ceaa25f](https://github.com/codsen/codsen/commit/ceaa25fb4f11a159dd0aa369a8f29461d884b42d))


### BREAKING CHANGES

* previously: "import groupStr from ..." - now "import { groupStr } from ..."
* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





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
