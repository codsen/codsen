# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.8.18](https://gitlab.com/codsen/codsen/compare/email-comb@3.8.17...email-comb@3.8.18) (2019-12-14)

**Note:** Version bump only for package email-comb





## 3.8.0 (2019-09-17)

### Bug Fixes

- correctly recognise single and double apostrophes within the text, outside tags ([5f7f428](https://gitlab.com/codsen/codsen/commit/5f7f428))

### Features

- recognise single-double-single/double-single-double quotes within attr values ([3eeaf1e](https://gitlab.com/codsen/codsen/commit/3eeaf1e))

## 3.7.1 (2019-09-11)

### Bug Fixes

- remove leading spaces in cleaned like class=" zz" and tighten up class/id recognition ([a900e4e](https://gitlab.com/codsen/codsen/commit/a900e4e))

## 3.7.0 (2019-09-04)

### Features

- recognise bracket notation ([ce0a0b1](https://gitlab.com/codsen/codsen/commit/ce0a0b1))

## 3.6.0 (2019-08-24)

### Features

- support quoteless attributes that come out of other minifiers ([9129fad](https://gitlab.com/codsen/codsen/commit/9129fad))

## 3.5.0 (2019-08-08)

### Features

- support for liquid template engine double curlies as CSS style values in head CSS ([819df36](https://gitlab.com/codsen/codsen/commit/819df36))

## 3.4.0 (2019-06-29)

### Features

- Add perf measurement, comparing and recording ([44f7a9e](https://gitlab.com/codsen/codsen/commit/44f7a9e))

## 3.3.0 (2019-06-25)

### Features

- Output object's new keys countBeforeCleaning and countAfterCleaning ([55b13e7](https://gitlab.com/codsen/codsen/commit/55b13e7))
- Uglification legend does not mention entries which were not uglified because of being whitelis ([b6bacfc](https://gitlab.com/codsen/codsen/commit/b6bacfc))

## 3.2.0 (2019-06-21)

### Features

- opts.removeCSSComments ([b848d1c](https://gitlab.com/codsen/codsen/commit/b848d1c))
- Uglification based on class/id characters but not class/id position in the reference array ([c839977](https://gitlab.com/codsen/codsen/commit/c839977))

## 3.1.0 (2019-06-18)

### Features

- If uglification was turned on, output legend under log.uglified ([805ce2d](https://gitlab.com/codsen/codsen/commit/805ce2d))
- opts.reportProgressFunc ([f5935fb](https://gitlab.com/codsen/codsen/commit/f5935fb))
- opts.reportProgressFuncFrom and opts.reportProgressFuncTo ([8734cc5](https://gitlab.com/codsen/codsen/commit/8734cc5))

## 3.0.0 (2019-06-01)

### Features

- Change the default export to { comb } instead of function exported as default ([3db706e](https://gitlab.com/codsen/codsen/commit/3db706e))

### BREAKING CHANGES

- Now you must consume importing or requiring { comb } instead of assigning to any
  variable you like as before

## 2.0.10 (2019-03-22)

### Bug Fixes

- The comma bug where unused chunk was sandwiched by used chunks ([cb6fa4c](https://gitlab.com/codsen/codsen/commit/cb6fa4c))

## 1.2.8 (2019-02-26)

### Bug Fixes

- Empty media queries in tight scenarios not being removed completely ([d4f1d8e](https://gitlab.com/codsen/codsen/commit/d4f1d8e))

## 1.2.7 (2019-02-10)

### Bug Fixes

- Fix the Create New Issue URLs ([c5ee4a6](https://gitlab.com/codsen/codsen/commit/c5ee4a6))

## 1.2.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.0.0 (2018-12-15)

- ✨ Renaming `email-remove-unused-css` to `email-comb` and resetting versions to `1.0.0`
