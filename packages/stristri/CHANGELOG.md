# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.1.14](https://github.com/codsen/codsen/compare/stristri@4.1.13...stristri@4.1.14) (2022-10-23)

**Note:** Version bump only for package stristri

# 4.1.0 (2022-08-12)

### Features

- export types ([cc5a180](https://github.com/codsen/codsen/commit/cc5a1807c10a1a9abe4f3b950ba75acef690c3e9))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 4.0.17 (2022-04-18)

### Fixed

- tweak types ([03cabe7](https://github.com/codsen/codsen/commit/03cabe7274fe093742dadb74ef94a5df62f6b9ca))

## 4.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 3.2.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 3.1.7 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 3.1.0 (2021-03-14)

### Features

- separate the inline <script> contents - add a new option, "js" ([b7aac4b](https://github.com/codsen/codsen/commit/b7aac4b0b8490fad2bd8ec8ec232ae4a8de7867c))

## 3.0.1 (2021-01-28)

### Fixed

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 3.0.0 (2021-01-23)

### Features

- rewrite in TS ([bffdb9b](https://github.com/codsen/codsen/commit/bffdb9bc670f5164795ec1c4a100b81b3e5e6b04))

### BREAKING CHANGES

- there are no API changes but we're bumping _major_ just in case

## 2.0.0 (2020-12-09)

### Features

- add opts.reportProgressFunc, remove reported ranges ([5021681](https://git.sr.ht/~royston/codsen/commit/5021681dfc7bde4be6750f73daeb5b0448a39c4f))
- report log of time taken ([f9b575f](https://git.sr.ht/~royston/codsen/commit/f9b575fc7d7d09ddbb5d8f6914b73d6bfc366165))

### BREAKING CHANGES

- ranges are not reported in result any more because it's too resource taxing to
  calculate the collapsed result ranges on top of del

## 1.1.0 (2020-12-06)

### Features

- initial release ([03866cc](https://git.sr.ht/~royston/codsen/commit/03866cca2d5a5611179c9c79d61abfc49a56ce56))
