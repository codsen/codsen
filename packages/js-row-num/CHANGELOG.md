# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 7.2.3 (2026-09-01)

### Bug Fixes

- align range input and output types ([1a13db6](https://github.com/codsen/codsen/commit/1a13db665fe2f9e77c6b5fd509980c87e5a57baf))

## 7.2.2 (2026-08-22)

### Performance Improvements

- optimise package hot paths and JSON editing ([f3112bd](https://github.com/codsen/codsen/commit/f3112bd7fc0d7c9bc09312d3744c950691d72ca5))

## 7.2.0 (2026-08-19)

### Bug Fixes

- make validation diagnostics safe ([7b01074](https://github.com/codsen/codsen/commit/7b0107476f12734aeb8e82852ba980b187280110))
- resolve various review findings ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

### Reverts

- Revert "Merge pull request #128 from codsen/release/npm-32198404552-1" ([5baeeaa](https://github.com/codsen/codsen/commit/5baeeaaa677b86f1eaa6396cadf3aea32b06416e)), closes [#128](https://github.com/codsen/codsen/issues/128)
- Revert "Merge pull request #127 from codsen/release/npm-32194020886-1" ([5f1e94d](https://github.com/codsen/codsen/commit/5f1e94deef910ce735266b16aeee08a76de7a862)), closes [#127](https://github.com/codsen/codsen/issues/127)

## 7.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 6.0.0 (2022-11-14)

### Features

- return both string and ranges ([3932619](https://github.com/codsen/codsen/commit/39326195ebf97a2ef3e3b29534a08c2c8b115f9e))

### BREAKING CHANGES

- main function returns both string and ranges; output is not a plain object; no more
  opts.returnRangesOnly

## 5.2.0 (2022-08-12)

### Features

- export types ([d732d0c](https://github.com/codsen/codsen/commit/d732d0c0447ec355650b632aae6906e71a621e50))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 5.1.2 (2022-04-18)

### Fixed

- tweak types ([e215772](https://github.com/codsen/codsen/commit/e215772dc1c9f9efcbdc92f26c3370f5dd0e027e))

## 5.1.0 (2022-04-11)

### Features

- export `defaults` and `version` ([1107244](https://github.com/codsen/codsen/commit/1107244b45eff96ac1fc4ab992031ede0d10ba8c))

## 5.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 4.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 4.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 4.0.1 (2021-01-28)

### Fixed

- add `testStats` to npm ignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 4.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([e10c809](https://github.com/codsen/codsen/commit/e10c8093a07a7ed633e088eca22de9780862603a))

### BREAKING CHANGES

- previously: `import fixRowNums from ...` - now `import { fixRowNums } from ...`

## 2.7.0 (2019-12-14)

### Fixed

- fix the regression of letters in front of digits not causing a bailout ([d141967](https://gitlab.com/codsen/codsen/commit/d14196750fa3b83d049bbd573fe0851ef150120f))
- set up Tap as a test runner, write many more unit tests and fix all remaining issues ([58e1471](https://gitlab.com/codsen/codsen/commit/58e147195282077df7ad20efb00dac95976ac24d))

### Features

- fix the digit recognition when they're given in quotes only or as num only ([b787c1e](https://gitlab.com/codsen/codsen/commit/b787c1ed86671311a21f842e42f2305e5914b15b))

## 2.6.0 (2019-12-09)

### Features

- expand the spectrum of patterns recognised under `opts.extractedLogContentsWereGiven` ([5fc1fe3](https://gitlab.com/codsen/codsen/commit/5fc1fe3e9fece9cbf99a013b9c911768366d80e7))
- `opts.extractedLogContentsWereGiven` ([de3a781](https://gitlab.com/codsen/codsen/commit/de3a781cd78ca0d4c276d4f0a177a4da1f4237c2))
- `opts.overrideRowNum` ([a81cc76](https://gitlab.com/codsen/codsen/commit/a81cc768f317f54d4456c4891c31ebedf5282b88))
- `opts.returnRangesOnly` ([c874453](https://gitlab.com/codsen/codsen/commit/c87445382d887631de6ba048a2e54bb0c65c8f9f))

## 2.6.0 (2019-11-30)

`opts.overrideRowNum` will stop the program from counting row numbers and will place that integer instead.

## 2.5.0 (2019-11-27)

### Features

- ignore new lines in front of a row numbers ([e6d78d6](https://gitlab.com/codsen/codsen/commit/e6d78d6a830f06e5a7910ea266367b0d16dc3fd1))

## 2.4.0 (2019-10-05)

### Features

- `opts.triggerKeywords` ([d76cf72](https://gitlab.com/codsen/codsen/commit/d76cf72))
- `opts.triggerKeywords` ([8ef01ae](https://gitlab.com/codsen/codsen/commit/8ef01ae))

## 2.3.0 (2019-06-18)

### Features

- Remove `check-types-mini` dependency to make it more efficient ([c36ce2f](https://gitlab.com/codsen/codsen/commit/c36ce2f))

## 2.2.0 (2019-06-01)

### Features

- Lower the 4 digit padding threshold to 45K characters ([e5f8ec7](https://gitlab.com/codsen/codsen/commit/e5f8ec7))

## 2.1.0 (2019-04-06)

### Features

- Bump padding to four if input is longer than 50K characters ([6855b53](https://gitlab.com/codsen/codsen/commit/6855b53))

## 1.3.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 1.1.0 (2018-12-26)

- `String.padStart` is ECMAScript 2017 which limits the Node versions we can support, so we replaced it ([5a49a2e](https://gitlab.com/codsen/codsen/tree/master/packages/js-row-num/commits/5a49a2e))

## 1.0.0 (2017-07-11)

- First public release
