# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.0.0 (2020-11-28)


### Bug Fixes

* Tweak the algorithm and add more unit tests ([1008482](https://git.sr.ht/~royston/codsen/commits/1008482b6e230d3199792100fb970e1c04dec339))
* Tweak the chompRight algorithm to match two characters repeated vs more ([8403566](https://git.sr.ht/~royston/codsen/commits/84035668eca4a9ac96baf93fbcc4743f1a9de85d))


### Features

* `opts.leftStopAtRawNbsp` ([8578392](https://git.sr.ht/~royston/codsen/commits/8578392c727b460a17a111085a8296e96106f602))
* `opts.rightStopAtRawNbsp` ([3abda38](https://git.sr.ht/~royston/codsen/commits/3abda381f4f481a624b5520ded8529130ab00f34))
* API tweaks ([2ce37c3](https://git.sr.ht/~royston/codsen/commits/2ce37c3e1766a351e41f7436b6c5a23a6c734ade))
* Case insensitive opts to seqLeft and seqRight ([fafbf19](https://git.sr.ht/~royston/codsen/commits/fafbf19f63f602b5241fa4935fdd968779fcf1c0))
* chompLeft() ([81e44f0](https://git.sr.ht/~royston/codsen/commits/81e44f0e43b1ab02fe5396b63e68a04ba66abd14))
* chompRight() ([e02a16f](https://git.sr.ht/~royston/codsen/commits/e02a16f5fe9e07c65356f9d6b3de464e2d2fdfd0))
* Hungry chomp ([fd07afd](https://git.sr.ht/~royston/codsen/commits/fd07afdbda27df873add48493a880b703c44fabf))
* Initial release ([6a3394b](https://git.sr.ht/~royston/codsen/commits/6a3394bfb849ab172f8dff169e722914b374ccfd))
* leftSeq and rightSeq ([f5e075e](https://git.sr.ht/~royston/codsen/commits/f5e075ec9495895b2f77dfe39cde4562d2fb8843))
* Merge modes via opts.mergeType ([7fb1c5f](https://git.sr.ht/~royston/codsen/commits/7fb1c5f319aa41ea54c68eed004ab2dfdc7425bf))
* Optional arguments via appended ? character ([90efa04](https://git.sr.ht/~royston/codsen/commits/90efa04bc7373d1fbba1e23cb3356178ec245216))
* two new methods: rightStopAtNewLines() and leftStopAtNewLines() ([cfb7557](https://git.sr.ht/~royston/codsen/commits/cfb7557a1f61390ab8282cd0a59f135b56d310bc))


### BREAKING CHANGES

* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





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
