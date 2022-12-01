# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2022-12-01)

### Features

- drop Node v12 support; minimum version requirement now is v14.18 and above ([c8049e8](https://github.com/codsen/codsen/commit/c8049e82a5844d3f72587740f1cc74e3c9020d22))

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

# 3.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

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

- rewrite in TS, start using named exports ([a58c07d](https://github.com/codsen/codsen/commit/a58c07de67782b699f4534a61fd0fd22e1aac29e))

### BREAKING CHANGES

- previously: `import isJinjaNunjucksRegex from ...` - now `import { isJinjaNunjucksRegex } from ...`

## 1.1.0 (2020-12-04)

- initial release ([85c91c5](https://git.sr.ht/~royston/codsen/commit/85c91c5c4f9fec7aa53e9105f7f758a080a52445))
