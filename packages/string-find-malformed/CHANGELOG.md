# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.2.7](https://github.com/codsen/codsen/compare/string-find-malformed@3.2.6...string-find-malformed@3.2.7) (2022-11-03)

**Note:** Version bump only for package string-find-malformed

# 3.2.0 (2022-08-12)

### Features

- export types ([ffaccc5](https://github.com/codsen/codsen/commit/ffaccc5fcdf62e013d09a5ea7f111ac21cc49dee))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 3.1.2 (2022-04-18)

### Fixed

- tweak the types ([dd6a429](https://github.com/codsen/codsen/commit/dd6a429e54dac5d58c2be72261f59e556e605f86))

# 3.1.0 (2022-04-11)

### Features

- export defaults and version ([1107244](https://github.com/codsen/codsen/commit/1107244b45eff96ac1fc4ab992031ede0d10ba8c))

## 3.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 2.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 2.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 2.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 2.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([ea15d44](https://github.com/codsen/codsen/commit/ea15d447477dacbee1413c904fa2e2efc5681a93))

### BREAKING CHANGES

- previously: `import findMalformed from ...` - now `import { findMalformed } from ...`

## 1.2.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.1.5 (2020-04-26)

### Fixed

- harden the eslint rules set and make all unit tests pass again and rebase a little ([52328ea](https://gitlab.com/codsen/codsen/commit/52328ea1f1a691513676d5bac259705ed61444d4))

## 1.1.0 (2020-03-16)

### Fixed

- correction to the algorithm ([f1f4a00](https://gitlab.com/codsen/codsen/commit/f1f4a00c2a7dc43fbb13c1eff209beb12dfb0bd9))

### Features

- init ([8199031](https://gitlab.com/codsen/codsen/commit/81990319e699bfc0e3ecf8a7ee38ca8ce46c46a9))
- tweak the matching algorithm to jump to next character if not matched ([f4b0e40](https://gitlab.com/codsen/codsen/commit/f4b0e40729390b950adf7ebc45e01f0d75a34a4a))

## 1.0.0 (2020-03-01)

- First public release
