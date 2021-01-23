# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))
* fix the regression of letters in front of digits not causing a bailout ([42df562](https://github.com/codsen/codsen/commit/42df56214564cf7c48653c6ec78d1a578b53980c))
* set up Tap as a test runner, write many more unit tests and fix all remaining issues ([300d6a9](https://github.com/codsen/codsen/commit/300d6a998f0b3549af569b4b72c9d5898e7a981f))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* Bump padding to four if input is longer than 50K characters ([927cfc8](https://github.com/codsen/codsen/commit/927cfc8a3321e064990542d93db47f627096f1ab))
* expand the spectrum of patterns recognised under opts.extractedLogContentsWereGiven ([2160ae5](https://github.com/codsen/codsen/commit/2160ae5ade970c9cb4d5c432d2481f8ac6af4582))
* fix the digit recognition when they're given in quotes only or as num only ([b946274](https://github.com/codsen/codsen/commit/b94627482f61e59f326b4c6355016643b4471516))
* ignore new lines in front of a row numbers ([5fbb2c9](https://github.com/codsen/codsen/commit/5fbb2c94e9dd6931cfbf9dd68b97a99c92f92841))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* Lower the 4 digit padding threshold to 45K characters ([fe0fb97](https://github.com/codsen/codsen/commit/fe0fb97a3d0252ad9d0cda03f8f3c9c5b785ba94))
* Merge modes via opts.mergeType ([2394464](https://github.com/codsen/codsen/commit/2394464976ce1970bcd31b45d9fd9955f4bbcc09))
* opts.extractedLogContentsWereGiven ([8d83957](https://github.com/codsen/codsen/commit/8d83957602f66ff44b654e710451ce8644846e02))
* opts.overrideRowNum ([4585cd9](https://github.com/codsen/codsen/commit/4585cd9ca1195b74372b75eb310a7b511f20bc21))
* opts.returnRangesOnly ([fdb7dfd](https://github.com/codsen/codsen/commit/fdb7dfdd97f07792d5d5d175955ef538e0881582))
* opts.triggerKeywords ([139610f](https://github.com/codsen/codsen/commit/139610f7d782b8538da950963b6cd0208bc38398))
* opts.triggerKeywords ([2b5e041](https://github.com/codsen/codsen/commit/2b5e041762b333812986ba2b03ee2901a4a44f31))
* Remove check-types-mini dependency to make it more efficient ([9c1e00d](https://github.com/codsen/codsen/commit/9c1e00d8c730ae2f0bad82bd87325d73e5e6206c))
* rewrite in TS, start using named exports ([e10c809](https://github.com/codsen/codsen/commit/e10c8093a07a7ed633e088eca22de9780862603a))
* String.padStart is Ecmascript 2017 which limits the Node versions we can support, so we replaced it ([f4f80c6](https://github.com/codsen/codsen/commit/f4f80c68695ba2cb727ebe8b02bc23591f1a6ab8))


### BREAKING CHANGES

* previously: "import fixRowNums from ..." - now "import { fixRowNums } from ..."
* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





## 3.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.7.0 (2019-12-14)

### Bug Fixes

- fix the regression of letters in front of digits not causing a bailout ([d141967](https://gitlab.com/codsen/codsen/commit/d14196750fa3b83d049bbd573fe0851ef150120f))
- set up Tap as a test runner, write many more unit tests and fix all remaining issues ([58e1471](https://gitlab.com/codsen/codsen/commit/58e147195282077df7ad20efb00dac95976ac24d))

### Features

- fix the digit recognition when they're given in quotes only or as num only ([b787c1e](https://gitlab.com/codsen/codsen/commit/b787c1ed86671311a21f842e42f2305e5914b15b))

## 2.6.0 (2019-12-09)

### Features

- expand the spectrum of patterns recognised under opts.extractedLogContentsWereGiven ([5fc1fe3](https://gitlab.com/codsen/codsen/commit/5fc1fe3e9fece9cbf99a013b9c911768366d80e7))
- opts.extractedLogContentsWereGiven ([de3a781](https://gitlab.com/codsen/codsen/commit/de3a781cd78ca0d4c276d4f0a177a4da1f4237c2))
- opts.overrideRowNum ([a81cc76](https://gitlab.com/codsen/codsen/commit/a81cc768f317f54d4456c4891c31ebedf5282b88))
- opts.returnRangesOnly ([c874453](https://gitlab.com/codsen/codsen/commit/c87445382d887631de6ba048a2e54bb0c65c8f9f))

## 2.6.0 (2019-11-30)

`opts.overrideRowNum` will stop the program from counting row numbers and will place that integer instead.

## 2.5.0 (2019-11-27)

### Features

- ignore new lines in front of a row numbers ([e6d78d6](https://gitlab.com/codsen/codsen/commit/e6d78d6a830f06e5a7910ea266367b0d16dc3fd1))

## 2.4.0 (2019-10-05)

### Features

- opts.triggerKeywords ([d76cf72](https://gitlab.com/codsen/codsen/commit/d76cf72))
- opts.triggerKeywords ([8ef01ae](https://gitlab.com/codsen/codsen/commit/8ef01ae))

## 2.3.0 (2019-06-18)

### Features

- Remove check-types-mini dependency to make it more efficient ([c36ce2f](https://gitlab.com/codsen/codsen/commit/c36ce2f))

## 2.2.0 (2019-06-01)

### Features

- Lower the 4 digit padding threshold to 45K characters ([e5f8ec7](https://gitlab.com/codsen/codsen/commit/e5f8ec7))

## 2.1.0 (2019-04-06)

### Features

- Bump padding to four if input is longer than 50K characters ([6855b53](https://gitlab.com/codsen/codsen/commit/6855b53))

## 1.3.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.1.0 (2018-12-26)

- ✨ `String.padStart` is Ecmascript 2017 which limits the Node versions we can support, so we replaced it ([5a49a2e](https://gitlab.com/codsen/codsen/tree/master/packages/js-row-num/commits/5a49a2e))

## 1.0.0 (2017-07-11)

- ✨ First public release
