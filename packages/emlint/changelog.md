# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 0.8.0 (2019-02-26)

### Bug Fixes

- Algorithm tweaks ([b5875ff](https://gitlab.com/codsen/codsen/commit/b5875ff))
- Algorithm tweaks ([2c4e4c5](https://gitlab.com/codsen/codsen/commit/2c4e4c5))
- All unit tests pass ([b7aee54](https://gitlab.com/codsen/codsen/commit/b7aee54))

### Features

- Correctly recognises brackets within attribute values ([836bfe2](https://gitlab.com/codsen/codsen/commit/836bfe2))
- Excessive whitespace before missing closing bracket ([b7ecdc9](https://gitlab.com/codsen/codsen/commit/b7ecdc9))
- Excessive whitespace instead of a missing closing quotes ([0bf97ed](https://gitlab.com/codsen/codsen/commit/0bf97ed))
- Excessive whitespace then slash instead of closing quotes ([68da8b5](https://gitlab.com/codsen/codsen/commit/68da8b5))
- Rule tag-attribute-repeated-equal ([cdcbe09](https://gitlab.com/codsen/codsen/commit/cdcbe09))
- Rule tag-missing-closing-bracket ([6f495c5](https://gitlab.com/codsen/codsen/commit/6f495c5))
- Rules combo: missing closing quotes and whitespace between slash and bracket ([960a0f2](https://gitlab.com/codsen/codsen/commit/960a0f2))
- WIP - 1 failing ([14c5ab4](https://gitlab.com/codsen/codsen/commit/14c5ab4))
- WIP - 10 failing ([d8f93f6](https://gitlab.com/codsen/codsen/commit/d8f93f6))
- WIP - 12 failing ([0a7aae2](https://gitlab.com/codsen/codsen/commit/0a7aae2))
- WIP - 12 failing ([58a9e16](https://gitlab.com/codsen/codsen/commit/58a9e16))
- WIP - 14 failing ([3fc3ac9](https://gitlab.com/codsen/codsen/commit/3fc3ac9))
- WIP - 19 failing ([3d5ba75](https://gitlab.com/codsen/codsen/commit/3d5ba75))
- WIP - 19 failing - before rewriting missing closing attr quotes ([080b24a](https://gitlab.com/codsen/codsen/commit/080b24a))
- WIP - 2 failing ([c29b315](https://gitlab.com/codsen/codsen/commit/c29b315))
- WIP - 20 failing ([226aa50](https://gitlab.com/codsen/codsen/commit/226aa50))
- WIP - 21 failing ([1657d4f](https://gitlab.com/codsen/codsen/commit/1657d4f))
- WIP - 21 failing ([b3efd34](https://gitlab.com/codsen/codsen/commit/b3efd34))
- WIP - 22 failing ([d7383c3](https://gitlab.com/codsen/codsen/commit/d7383c3))
- WIP - 4 failing ([ebc1150](https://gitlab.com/codsen/codsen/commit/ebc1150))
- WIP - 4 failing ([b33fc7c](https://gitlab.com/codsen/codsen/commit/b33fc7c))
- WIP - 4 failing ([c0cfbfd](https://gitlab.com/codsen/codsen/commit/c0cfbfd))
- WIP - 45 failing ([15b092e](https://gitlab.com/codsen/codsen/commit/15b092e))
- WIP - 5 failing ([1151c5b](https://gitlab.com/codsen/codsen/commit/1151c5b))
- WIP - 6 failing ([eb9efd4](https://gitlab.com/codsen/codsen/commit/eb9efd4))
- WIP - 8 failing ([1b9ce78](https://gitlab.com/codsen/codsen/commit/1b9ce78))
- WIP - 8 failing ([5237f6a](https://gitlab.com/codsen/codsen/commit/5237f6a))
- WIP - 9 failing - only Both Quotes Missing rules failing ([c42a001](https://gitlab.com/codsen/codsen/commit/c42a001))
- WIP - withinTagInnerspace() recoding, R1 & R2 clauses done ([91c9b6c](https://gitlab.com/codsen/codsen/commit/91c9b6c))
- WIP - withinTagInnerspace() recoding, two tests pass ([06d9bf4](https://gitlab.com/codsen/codsen/commit/06d9bf4))

## 0.7.0 (2019-02-10)

### Bug Fixes

- Add more false-outcome unit tests and tweak the algorithm edge cases to pass all tests ([3563c3e](https://gitlab.com/codsen/codsen/commit/3563c3e))
- Algorithm tweaks to pass all unit tests ([d576d39](https://gitlab.com/codsen/codsen/commit/d576d39))
- Fix the Create New Issue URLs ([c5ee4a6](https://gitlab.com/codsen/codsen/commit/c5ee4a6))
- Treats legit quotes of the opposite kind within healthy quotes correctly ([a390e6d](https://gitlab.com/codsen/codsen/commit/a390e6d))
- Tweak the detection algorithm of some false cases ([18c368d](https://gitlab.com/codsen/codsen/commit/18c368d))

### Features

- Improve recognition of attribute sequences ([998f718](https://gitlab.com/codsen/codsen/commit/998f718))
- Rule tag-attribute-missing-equal ([06c5992](https://gitlab.com/codsen/codsen/commit/06c5992))
- Rules tag-attribute-missing-equal and tag-attribute-opening-quotation-mark-missing ([5f2f0d4](https://gitlab.com/codsen/codsen/commit/5f2f0d4))

## 0.6.0 (2019-02-05)

### Features

- Add rule `tag-attribute-space-between-name-and-equals` ([11653a9](https://gitlab.com/codsen/codsen/commit/11653a9))
- Improvements to rules `*-double-quotation-mark` ([d6f3307](https://gitlab.com/codsen/codsen/commit/d6f3307))
- Rule `tag-attribute-closing-quotation-mark-missing` ([f3ef429](https://gitlab.com/codsen/codsen/commit/f3ef429))
- Rule `tag-whitespace-tags-closing-slash-and-bracket` ([b65ee11](https://gitlab.com/codsen/codsen/commit/b65ee11))
- Rules `*-double-quotation-mark` ([e744a27](https://gitlab.com/codsen/codsen/commit/e744a27))
- Rules `tag-attribute-*-single-quotation-mark` ([7ec9b49](https://gitlab.com/codsen/codsen/commit/7ec9b49))
- Rules `tag-attribute-mismatching-quotes-is-*` ([1f8ca9e](https://gitlab.com/codsen/codsen/commit/1f8ca9e))
- Rules `tag-attribute-quote-and-onwards-missing` and `tag-generic-error` ([5182c0f](https://gitlab.com/codsen/codsen/commit/5182c0f))
- Rules: `tag-attribute-space-between-equals-and-opening-quotes` and `tag-excessive-whitespace-inside-tag` ([1da021b](https://gitlab.com/codsen/codsen/commit/1da021b))

## 0.5.0 (2019-01-31)

### Features

- New rule - `tag-name-lowercase` ([dfead6d](https://gitlab.com/codsen/codsen/commit/dfead6d))
- New rules `file-mixed-line-endings-file-is-\*-mainly` to cater mixed EOL files with no opts for EOL ([25e21ef](https://gitlab.com/codsen/codsen/commit/25e21ef))
- Wired up basic unit test cases for rule `file-mixed-line-endings-file-is-\*-mainly` ([46a549e](https://gitlab.com/codsen/codsen/commit/46a549e))

## 0.4.0 (2019-01-27)

### Features

- Add rules to identify non-printable low-range ASCII characters ([5471ccc](https://gitlab.com/codsen/codsen/tree/master/packages/emlint/commits/5471ccc))

## 0.1.0 (2018-08-27)

- ✨ First public release
