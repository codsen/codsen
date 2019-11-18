# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 2.1.0 (2019-11-18)

### Features

- add few more character rules ([8a14f7c](https://gitlab.com/codsen/codsen/commit/8a14f7cee7a15891ccfc59b584d4adc99fab4b23))
- add few more character rules ([2f06a84](https://gitlab.com/codsen/codsen/commit/2f06a84a79b2e265079577ed2576077c8c91ed84))
- add few more character rules ([e80737f](https://gitlab.com/codsen/codsen/commit/e80737f671a6e9d8a75dbfa83bbd39480c186cf7))
- complete creating rules for all ASCII range invisible characters ([3abb85b](https://gitlab.com/codsen/codsen/commit/3abb85b7578d73144cebebcadcd8f021de17a297))
- few more character rules ([e9048ca](https://gitlab.com/codsen/codsen/commit/e9048ca9056e207cb05cfbe2d05f71a94c542dd6))
- few more rules ([8a347be](https://gitlab.com/codsen/codsen/commit/8a347beacb3a6a89376216941bf224e1fb12a812))
- first rule with config, tag-space-before-closing-slash, also add string-left-right as a dep ([e6b6adb](https://gitlab.com/codsen/codsen/commit/e6b6adb4b100c9841514f5034aca04f38acdcf3e))
- grouped rules - "tag" and "bad-character" ([6aa5096](https://gitlab.com/codsen/codsen/commit/6aa5096ff45882b7e59b2afc30af6ac8fa4b1877))
- new rules tag-void-slash and tag-closing-backslash ([adce05d](https://gitlab.com/codsen/codsen/commit/adce05d630def6d775446fc9cda8a61366ff1f92))
- two more character rules ([3e7516f](https://gitlab.com/codsen/codsen/commit/3e7516fee7c54a58d1da35cc8b12d8b83707c97d))
- update config on tap to consume all grouped rules ([98d6af4](https://gitlab.com/codsen/codsen/commit/98d6af42a9453376c15f0717ca70cd64c732f8a2))

## 2.0.0 (2019-11-11)

### Features

- add more bad character rules ([4b5ae71](https://gitlab.com/codsen/codsen/commit/4b5ae7117a119db47dae965bd3c3518275891e81))
- make it pluggable - rewrite in observer pattern, separate the tokenizer and tap it ([1c0a0eb](https://gitlab.com/codsen/codsen/commit/1c0a0ebd7dcb307854c88eeee6049658b1a7c3a6))
- set up the tag-level processing, add the first character-level rule ([fc9a89f](https://gitlab.com/codsen/codsen/commit/fc9a89f5a5dbd3a9ee7fe6d14e2cefd21b5a59e0))

### BREAKING CHANGES

- rewrite in observer pattern

## 1.8.0 (2019-10-09)

### Bug Fixes

- make rule tag-space-after-opening-bracket not applicable for HTML comments ([3fac2f6](https://gitlab.com/codsen/codsen/commit/3fac2f61934979655fca35b03401c98facd224bb))

### Features

- improvements for recognition of ESP tags within attributes ([0c1e42c](https://gitlab.com/codsen/codsen/commit/0c1e42cf8d43ceb77259bcc0892ec517bbcef47b))

## 1.7.0 (2019-08-24)

### Features

- flags up characters outside of ASCII and suggests HTML (only, so far) encoding ([3e04e9e](https://gitlab.com/codsen/codsen/commit/3e04e9e))
- recognise email-unfriendly named HTML entities and suggest fixes ([8b9d2c8](https://gitlab.com/codsen/codsen/commit/8b9d2c8))
- when character outside ASCII is encoded, email-pattern encoding is considered ([80f516c](https://gitlab.com/codsen/codsen/commit/80f516c))

## 1.6.0 (2019-08-15)

### Features

- recognise tags with no attributes and with missing closing bracket ([08fe678](https://gitlab.com/codsen/codsen/commit/08fe678))

## 1.5.0 (2019-06-01)

### Features

- Algorithm tweaks to correspond to the latest API's of all deps ([7de00c2](https://gitlab.com/codsen/codsen/commit/7de00c2))

## 1.4.0 (2019-04-10)

### Features

- Algorithm improvements ([634dde7](https://gitlab.com/codsen/codsen/commit/634dde7))
- Dedupe repeated slash errors, now there's only one reported per tag ([bb53589](https://gitlab.com/codsen/codsen/commit/bb53589))
- Improve closing slash error reporting consistency and rule name precision ([a3d7570](https://gitlab.com/codsen/codsen/commit/a3d7570))
- Rule tag-duplicate-closing-slash ([8887552](https://gitlab.com/codsen/codsen/commit/8887552))

## 1.3.0 (2019-04-06)

### Features

- Broken CDATA recognition improvements ([a130abc](https://gitlab.com/codsen/codsen/commit/a130abc))
- Detect excessive whitespace in front of ESP tag ([b659586](https://gitlab.com/codsen/codsen/commit/b659586))
- Heuristical ESP tag recognition ([ef69bf7](https://gitlab.com/codsen/codsen/commit/ef69bf7))
- Improvements to CDATA rules and 4 new rules to cater HTML comments ([65e23c9](https://gitlab.com/codsen/codsen/commit/65e23c9))
- Improvements to malformed CDATA tag recognition algorithm ([8bc571f](https://gitlab.com/codsen/codsen/commit/8bc571f))
- Nested function-based ESP templating tag support ([ab86a85](https://gitlab.com/codsen/codsen/commit/ab86a85))
- Recognise ESP tags within HTML tags ([764ee1d](https://gitlab.com/codsen/codsen/commit/764ee1d))
- Recognise single character ESP closing tag endings ([ee4fe96](https://gitlab.com/codsen/codsen/commit/ee4fe96))
- Rudimentary protection against CSS false positive display:block ([8c14b90](https://gitlab.com/codsen/codsen/commit/8c14b90))
- Rule esp-line-break-within-templating-tag ([b3cc442](https://gitlab.com/codsen/codsen/commit/b3cc442))
- Rules esp-more-closing-parentheses-than-opening & esp-more-opening-parentheses-than-closing ([5235b15](https://gitlab.com/codsen/codsen/commit/5235b15))

## 1.2.0 (2019-03-17)

### Features

- Implement opts for each rule ([f2be977](https://gitlab.com/codsen/codsen/commit/f2be977))
- res.applicableRules - reports what rules could be applicable for given input ([d5fb5a0](https://gitlab.com/codsen/codsen/commit/d5fb5a0))

## 1.0.0 (2019-03-04)

### Features

- Integrate package `string-fix-broken-named-entities` ([bf26962](https://gitlab.com/codsen/codsen/commit/bf26962))
- Rule `tag-generic-error` ([70dd628](https://gitlab.com/codsen/codsen/commit/70dd628))
- Rules `tag-missing-space-before-attribute` and `tag-stray-quotes` ([fe7c5af](https://gitlab.com/codsen/codsen/commit/fe7c5af))

## 0.8.0 (2019-02-26)

### Bug Fixes

- Algorithm tweaks ([b5875ff](https://gitlab.com/codsen/codsen/commit/b5875ff))
- Algorithm tweaks ([2c4e4c5](https://gitlab.com/codsen/codsen/commit/2c4e4c5))
- All unit tests pass ([b7aee54](https://gitlab.com/codsen/codsen/commit/b7aee54))

### Features

- Rule `tag-attribute-repeated-equal` ([cdcbe09](https://gitlab.com/codsen/codsen/commit/cdcbe09))
- Rule `tag-missing-closing-bracket` ([6f495c5](https://gitlab.com/codsen/codsen/commit/6f495c5))
- Rules combo: missing closing quotes and whitespace between slash and bracket ([960a0f2](https://gitlab.com/codsen/codsen/commit/960a0f2))
- Correctly recognises brackets within attribute values ([836bfe2](https://gitlab.com/codsen/codsen/commit/836bfe2))
- Excessive whitespace before missing closing bracket ([b7ecdc9](https://gitlab.com/codsen/codsen/commit/b7ecdc9))
- Excessive whitespace instead of a missing closing quotes ([0bf97ed](https://gitlab.com/codsen/codsen/commit/0bf97ed))
- Excessive whitespace then slash instead of closing quotes ([68da8b5](https://gitlab.com/codsen/codsen/commit/68da8b5))

## 0.7.0 (2019-02-10)

### Features

- Improve recognition of attribute sequences ([998f718](https://gitlab.com/codsen/codsen/commit/998f718))
- Rule `tag-attribute-missing-equal` tweaks ([06c5992](https://gitlab.com/codsen/codsen/commit/06c5992))
- Rules `tag-attribute-missing-equal` and `tag-attribute-opening-quotation-mark-missing` ([5f2f0d4](https://gitlab.com/codsen/codsen/commit/5f2f0d4))

### Bug Fixes

- Add more false-outcome unit tests and tweak the algorithm edge cases to pass all tests ([3563c3e](https://gitlab.com/codsen/codsen/commit/3563c3e))
- Algorithm tweaks to pass all unit tests ([d576d39](https://gitlab.com/codsen/codsen/commit/d576d39))
- Fix the Create New Issue URLs ([c5ee4a6](https://gitlab.com/codsen/codsen/commit/c5ee4a6))
- Treats legit quotes of the opposite kind within healthy quotes correctly ([a390e6d](https://gitlab.com/codsen/codsen/commit/a390e6d))
- Tweak the detection algorithm of some false cases ([18c368d](https://gitlab.com/codsen/codsen/commit/18c368d))

## 0.6.0 (2019-02-05)

### Features

- Rule `tag-attribute-space-between-name-and-equals` ([11653a9](https://gitlab.com/codsen/codsen/commit/11653a9))
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
