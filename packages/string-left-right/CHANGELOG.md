# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2021-01-23)


### Bug Fixes

* Tweak the algorithm and add more unit tests ([92a052f](https://github.com/codsen/codsen/commit/92a052f5826d05d5706ab313c1e6b36786bfabab))
* Tweak the chompRight algorithm to match two characters repeated vs more ([1762076](https://github.com/codsen/codsen/commit/1762076a6bb8cf70d334abcc8b2f3a644c9da091))


### Features

* `opts.leftStopAtRawNbsp` ([b93833f](https://github.com/codsen/codsen/commit/b93833fd3b0ce70c7da387d0382da957db47356b))
* `opts.rightStopAtRawNbsp` ([0c8964e](https://github.com/codsen/codsen/commit/0c8964e301c6b0451b87835fa266dab99ae7c1fa))
* API tweaks ([0841316](https://github.com/codsen/codsen/commit/08413168376cd572a5dd5544393f5077bdb292b9))
* Case insensitive opts to seqLeft and seqRight ([caf566f](https://github.com/codsen/codsen/commit/caf566f3ce9eaec97550e2de0ef424d1e6daf2aa))
* chompLeft() ([a2b721e](https://github.com/codsen/codsen/commit/a2b721e9e8f4370b000890004bc712f78f2ac7d1))
* chompRight() ([02ffe12](https://github.com/codsen/codsen/commit/02ffe1219d368cba61938721542d66c77920be35))
* Hungry chomp ([384be2d](https://github.com/codsen/codsen/commit/384be2d14d1144ada68ba5f6c3d8dde2291be4a1))
* Initial release ([af3f37c](https://github.com/codsen/codsen/commit/af3f37ce5095c7a7a1839a428c6fb59a6b388d36))
* leftSeq and rightSeq ([f677fdc](https://github.com/codsen/codsen/commit/f677fdc153ac7e7435d7de804d8829fe6755d9cb))
* Merge modes via opts.mergeType ([2394464](https://github.com/codsen/codsen/commit/2394464976ce1970bcd31b45d9fd9955f4bbcc09))
* Optional arguments via appended ? character ([d34e9d7](https://github.com/codsen/codsen/commit/d34e9d7a3234c27a592f33c3ebf9541a9069700b))
* rewrite in TS ([7de8464](https://github.com/codsen/codsen/commit/7de846446d511a7d778e63b92c6f10f873388c72))
* two new methods: rightStopAtNewLines() and leftStopAtNewLines() ([fc5d456](https://github.com/codsen/codsen/commit/fc5d456c94d8f44dafff733b2e89068fc721b253))


### BREAKING CHANGES

* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





## 3.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.3.0 (2019-09-04)

### Features

- two new methods: rightStopAtNewLines() and leftStopAtNewLines() ([cfb7557](https://gitlab.com/codsen/codsen/commit/cfb7557))

## 2.2.0 (2019-04-06)

### Features

- Case insensitive opts to seqLeft and seqRight ([fafbf19](https://gitlab.com/codsen/codsen/commit/fafbf19))
- Hungry chomp ([fd07afd](https://gitlab.com/codsen/codsen/commit/fd07afd))

## 2.1.5 (2019-03-22)

### Bug Fixes

- Tweak the algorithm and add more unit tests ([1008482](https://gitlab.com/codsen/codsen/commit/1008482))
- Tweak the chompRight algorithm to match two characters repeated vs more ([8403566](https://gitlab.com/codsen/codsen/commit/8403566))

## 2.1.0 (2019-03-17)

### Features

- API tweaks ([2ce37c3](https://gitlab.com/codsen/codsen/commit/2ce37c3))
- chompLeft() ([81e44f0](https://gitlab.com/codsen/codsen/commit/81e44f0))
- chompRight() ([e02a16f](https://gitlab.com/codsen/codsen/commit/e02a16f))
- leftSeq and rightSeq ([f5e075e](https://gitlab.com/codsen/codsen/commit/f5e075e))
- Optional arguments via appended ? character ([90efa04](https://gitlab.com/codsen/codsen/commit/90efa04))

## 1.10.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.6.0 (2018-12-26)

- ✨ Added `opts.addSingleSpaceToPreventAccidentalConcatenation` ([19b1390](https://gitlab.com/codsen/codsen/tree/master/packages/string-left-right/commits/19b1390))

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
