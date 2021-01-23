# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* Merge modes via opts.mergeType ([2394464](https://github.com/codsen/codsen/commit/2394464976ce1970bcd31b45d9fd9955f4bbcc09))
* rewrite in TS and start using named exports ([c05c4d8](https://github.com/codsen/codsen/commit/c05c4d8282829c8bd69a1fe26692c584efa43d55))
* update to the latest ranges-merge which returns null now instead of empty array ([a02c8bb](https://github.com/codsen/codsen/commit/a02c8bbdecb94b5ba01f70d735684ecf4c48ee75))


### Performance Improvements

* remove check-types-mini ([392630b](https://github.com/codsen/codsen/commit/392630ba8af9f47f0b6324d3203d4b11eb3cac3c))


### BREAKING CHANGES

* previously: "import rEntDecode from ..." - now "import { rEntDecode } from ..."
* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





## 3.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.1.0 (2020-09-07)

### Features

- update to the latest ranges-merge which returns null now instead of empty array ([b36d068](https://gitlab.com/codsen/codsen/commit/b36d068bbd940f248d3ea46e5f37082887332785))

## 2.0.36 (2019-10-05)

### Performance Improvements

- remove check-types-mini ([90162d0](https://gitlab.com/codsen/codsen/commit/90162d0))

## 1.4.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.1.0 (2018-10-25)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 1.0.0 (2018-08-22)

- ✨ Initial release
