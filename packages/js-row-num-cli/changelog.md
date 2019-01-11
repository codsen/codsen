# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.4.0](https://bitbucket.org/codsen/codsen/src/master/packages/js-row-num-cli/compare/js-row-num-cli@1.3.6...js-row-num-cli@1.4.0) (2019-01-11)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/js-row-num-cli/commits/4f00871))

## [1.3.6](https://bitbucket.org/codsen/codsen/src/master/packages/js-row-num-cli/compare/js-row-num-cli@1.3.5...js-row-num-cli@1.3.6) (2019-01-02)

**Note:** Version bump only for package js-row-num-cli

## [1.3.5](https://bitbucket.org/codsen/codsen/src/master/packages/js-row-num-cli/compare/js-row-num-cli@1.3.4...js-row-num-cli@1.3.5) (2019-01-01)

**Note:** Version bump only for package js-row-num-cli

## [1.3.4](https://bitbucket.org/codsen/codsen/src/master/packages/js-row-num-cli/compare/js-row-num-cli@1.3.3...js-row-num-cli@1.3.4) (2018-12-29)

**Note:** Version bump only for package js-row-num-cli

## [1.3.3](https://bitbucket.org/codsen/codsen/src/master/packages/js-row-num-cli/compare/js-row-num-cli@1.3.2...js-row-num-cli@1.3.3) (2018-12-29)

**Note:** Version bump only for package js-row-num-cli

## [1.3.2](https://bitbucket.org/codsen/codsen/src/master/packages/js-row-num-cli/compare/js-row-num-cli@1.3.1...js-row-num-cli@1.3.2) (2018-12-27)

**Note:** Version bump only for package js-row-num-cli

## [1.3.1](https://bitbucket.org/codsen/codsen/src/master/packages/js-row-num-cli/compare/js-row-num-cli@1.3.0...js-row-num-cli@1.3.1) (2018-12-27)

**Note:** Version bump only for package js-row-num-cli

# 1.3.0 (2018-12-26)

### Features

- atomic file write ([b9a3c2b](https://bitbucket.org/codsen/codsen/src/master/packages/js-row-num-cli/commits/b9a3c2b))
- improved messages when zero files found + promisified write function ([83d2bee](https://bitbucket.org/codsen/codsen/src/master/packages/js-row-num-cli/commits/83d2bee))

## 1.2.0 (2018-09-20)

- ✨ Properly set the message when there were zero files to update
- ✨ Promisified the atomic write function

## 1.1.0 (2018-09-18)

- ✨ Now file writing is done [atomically](https://github.com/npm/write-file-atomic), the write operation now cannot be interrupted or "partially" performed. Practically, this means, it will be not possible to accidentally damage the processed `.js` file there's a clash between other programs (code editors, for example) reading it. I has happened to me in the past that `.js` file accidentally gets written to be blank. No more!
- ✨ Additionally, now we have a check implemented, is the freshly-read `.js` file not blank. If it's blank, nothing is written.

## 1.0.0 (2018-07-12)

- ✨ First public release
