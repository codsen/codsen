# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.0.0 (2020-11-28)


### Bug Fixes

* Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))
* fix the regression of letters in front of digits not causing a bailout ([d141967](https://git.sr.ht/~royston/codsen/commits/d14196750fa3b83d049bbd573fe0851ef150120f))
* set up Tap as a test runner, write many more unit tests and fix all remaining issues ([58e1471](https://git.sr.ht/~royston/codsen/commits/58e147195282077df7ad20efb00dac95976ac24d))


### Features

* Add one more tag before which there will be a line break ([4f00871](https://git.sr.ht/~royston/codsen/commits/4f008715dcc2de7b2b52b67ce2e27728d5ffec37))
* Bump padding to four if input is longer than 50K characters ([6855b53](https://git.sr.ht/~royston/codsen/commits/6855b535b4bf72cdfe550ec5bfe2652a61ffffc3))
* expand the spectrum of patterns recognised under opts.extractedLogContentsWereGiven ([5fc1fe3](https://git.sr.ht/~royston/codsen/commits/5fc1fe3e9fece9cbf99a013b9c911768366d80e7))
* fix the digit recognition when they're given in quotes only or as num only ([b787c1e](https://git.sr.ht/~royston/codsen/commits/b787c1ed86671311a21f842e42f2305e5914b15b))
* ignore new lines in front of a row numbers ([e6d78d6](https://git.sr.ht/~royston/codsen/commits/e6d78d6a830f06e5a7910ea266367b0d16dc3fd1))
* Initial release ([4f35bfb](https://git.sr.ht/~royston/codsen/commits/4f35bfb167e54b1a0e5e8f01871293b262c67a76))
* Lower the 4 digit padding threshold to 45K characters ([e5f8ec7](https://git.sr.ht/~royston/codsen/commits/e5f8ec7cd24e1d461c26cbdbfa19a17f3b204468))
* Merge modes via opts.mergeType ([7fb1c5f](https://git.sr.ht/~royston/codsen/commits/7fb1c5f319aa41ea54c68eed004ab2dfdc7425bf))
* opts.extractedLogContentsWereGiven ([de3a781](https://git.sr.ht/~royston/codsen/commits/de3a781cd78ca0d4c276d4f0a177a4da1f4237c2))
* opts.overrideRowNum ([a81cc76](https://git.sr.ht/~royston/codsen/commits/a81cc768f317f54d4456c4891c31ebedf5282b88))
* opts.returnRangesOnly ([c874453](https://git.sr.ht/~royston/codsen/commits/c87445382d887631de6ba048a2e54bb0c65c8f9f))
* opts.triggerKeywords ([d76cf72](https://git.sr.ht/~royston/codsen/commits/d76cf72532c292c0c5e0903332f8b785af8b48ee))
* opts.triggerKeywords ([8ef01ae](https://git.sr.ht/~royston/codsen/commits/8ef01ae1d04620fff248905affda897a78ab4204))
* Remove check-types-mini dependency to make it more efficient ([c36ce2f](https://git.sr.ht/~royston/codsen/commits/c36ce2fec7641253dbb2ee9a4d2aae221481beb1))
* String.padStart is Ecmascript 2017 which limits the Node versions we can support, so we replaced it ([5a49a2e](https://git.sr.ht/~royston/codsen/commits/5a49a2ea0c26c815c941e88d2ba9e22a28fd134e))


### BREAKING CHANGES

* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





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
