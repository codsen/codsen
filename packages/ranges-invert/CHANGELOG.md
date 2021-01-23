# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* If ranges exceed reference string length, result is cropped (as opposed to error) ([6b53b2e](https://github.com/codsen/codsen/commit/6b53b2e53a3f3fcda8553c96b8e81932ee5b3fd5))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* Merge modes via opts.mergeType ([2394464](https://github.com/codsen/codsen/commit/2394464976ce1970bcd31b45d9fd9955f4bbcc09))
* null instead of ranges array produces whole input string ([9346786](https://github.com/codsen/codsen/commit/934678612930f4d6e6c0cba2611c0fc3c29b7858))
* opts.skipChecks and precautionary measures when it's on ([a2c3071](https://github.com/codsen/codsen/commit/a2c30711589718b840c813d8bd31e70c2ce46b5d))
* rewrite in TS and start using named exports ([e8f27b9](https://github.com/codsen/codsen/commit/e8f27b970a472e65d4da1d45789e867b797ca2c8))


### Performance Improvements

* remove check-types-mini and ordinal numbers dependencies ([afd2da2](https://github.com/codsen/codsen/commit/afd2da2ad57bc2c9b19b26cebc2654e9853e7c5b))


### BREAKING CHANGES

* previously: "import rInvert from ..." - now "import { rInvert } from ..."
* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





## 3.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.1.22 (2019-10-02)

### Performance Improvements

- remove check-types-mini and ordinal numbers dependencies ([e62326c](https://gitlab.com/codsen/codsen/commit/e62326c))

## 2.1.0 (2019-06-01)

### Features

- If ranges exceed reference string length, result is cropped (as opposed to error) ([c05d954](https://gitlab.com/codsen/codsen/commit/c05d954))
- null instead of ranges array produces whole input string ([e3ff153](https://gitlab.com/codsen/codsen/commit/e3ff153))
- opts.skipChecks and precautionary measures when it's on ([b129666](https://gitlab.com/codsen/codsen/commit/b129666))

## 1.4.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.1.0 (2018-10-25)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 1.0.0 (2018-06-09)

- ✨ Initial release
