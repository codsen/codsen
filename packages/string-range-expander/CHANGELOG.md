# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.0.0 (2021-01-23)


### Bug Fixes

* fix for opts.wipeAllWhitespaceOnRight and left too ([6109691](https://github.com/codsen/codsen/commit/610969126ca12c7b201cf4e353a06d77c68de081))
* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))
* if****SideIncludesThisCropItToo algorithm tweaks when there is no whitespace ([bfaacca](https://github.com/codsen/codsen/commit/bfaacca8eddf3b74550c6f53673bdc9984ed2adc))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* improvements to opts.addSingleSpaceToPreventAccidentalConcatenation ([89e66f1](https://github.com/codsen/codsen/commit/89e66f1d9c32a07b25c907539fbf19210b3cac90))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* opts.addSingleSpaceToPreventAccidentalConcatenation ([e661543](https://github.com/codsen/codsen/commit/e6615432f3d01dbe9d6aad60af56010968aabe68))
* opts.addSingleSpaceToPreventAccidentalConcatenation improvements ([d7bc6dc](https://github.com/codsen/codsen/commit/d7bc6dcaf4aab92f553b2f36a1439f680ead98cf))
* opts.wipeAllWhitespaceOnLeft and opts.wipeAllWhitespaceOnRight ([55589aa](https://github.com/codsen/codsen/commit/55589aa84e1473ef8eee2ced648419e334c5cf28))
* refactor, remove all dependencies (there was only one) ([145b2aa](https://github.com/codsen/codsen/commit/145b2aa23b6f917f58afb4e5bf08c8a5dc8f810d))
* rewrite in TS, start using named exports ([ea4ccc3](https://github.com/codsen/codsen/commit/ea4ccc38c24614ac2e63538fc5880f10fc255d3e))
* tweak the types, some opts keys are optional, some are not ([c5cb159](https://github.com/codsen/codsen/commit/c5cb159a9ccdcf804a5197eb8718d0f4f41d5fe7))


### Performance Improvements

* remove check-types-mini to improve speed by around 500x ([30496f7](https://github.com/codsen/codsen/commit/30496f77c5943879fc22cd84b580021a91860156))


### BREAKING CHANGES

* previously: "import expander from ..." - now: "import { expander } from ..."





## 1.12.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.11.0 (2020-04-18)

### Features

- refactor, remove all dependencies (there was only one) ([6e49b8b](https://gitlab.com/codsen/codsen/commit/6e49b8b7c5a031f650f779d68480d91891aea66d))

## 1.10.45 (2019-10-02)

### Performance Improvements

- remove check-types-mini to improve speed by around 500x ([5e219a8](https://gitlab.com/codsen/codsen/commit/5e219a8))

## 1.10.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.6.0 (2018-12-26)

### Features

- improvements to opts.addSingleSpaceToPreventAccidentalConcatenation ([8bb929a](https://gitlab.com/codsen/codsen/tree/master/packages/string-range-expander/commits/8bb929a))
- opts.addSingleSpaceToPreventAccidentalConcatenation ([19b1390](https://gitlab.com/codsen/codsen/tree/master/packages/string-range-expander/commits/19b1390))
- opts.addSingleSpaceToPreventAccidentalConcatenation improvements ([47df5be](https://gitlab.com/codsen/codsen/tree/master/packages/string-range-expander/commits/47df5be))

## 1.5.0 (2018-10-26)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 1.4.0 (2018-09-20)

- ✨ Improvements to `opts.addSingleSpaceToPreventAccidentalConcatenation`, now it detects is there at least one digit or number around and if there's none, it doesn't add a space.

## 1.3.0 (2018-09-20)

- ✨ Improvements to cases when `opts.ifLeftSideIncludesThisThenCropTightly`/`opts.ifRightSideIncludesThisThenCropTightly` is an array
- ✨ Now we tend an edge case when `opts.addSingleSpaceToPreventAccidentalConcatenation` is surrounded by characters, whitelisted by `opts.ifLeftSideIncludesThisThenCropTightly` and `opts.ifRightSideIncludesThisThenCropTightly` (or just one of them, but then the other is a falsey empty string). In that case, the compensation space is not added.

## 1.2.0 (2018-09-18)

- ✨ New feature - `opts.addSingleSpaceToPreventAccidentalConcatenation`. It's off by default but if it's on, it can prevent accidental concatenation of string when chunk is deleted. It checks the outer edges of the string range what is about to be deleted and if non-whitespace surrounds both sides it adds a single space (as range's third argument).

## 1.0.0 (2018-09-11)

- ✨ First public release
