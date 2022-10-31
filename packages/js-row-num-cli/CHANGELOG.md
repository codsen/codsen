# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.2.10](https://github.com/codsen/codsen/compare/js-row-num-cli@2.2.9...js-row-num-cli@2.2.10) (2022-10-31)

**Note:** Version bump only for package js-row-num-cli

# 2.2.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

# 2.1.0 (2022-04-11)

### Features

- export defaults and version ([1107244](https://github.com/codsen/codsen/commit/1107244b45eff96ac1fc4ab992031ede0d10ba8c))

## 2.0.3 (2021-11-02)

### Features

- migrate to ES Modules ([c579dff](https://github.com/codsen/codsen/commit/c579dff3b23205e383035ca10ddcec671e35d0fe))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 2.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 1.9.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 1.8.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 1.8.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 1.7.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.6.7 (2019-11-20)

### Fixed

- update to the latest meow v4 api - fixes aliases ([5a0a098](https://gitlab.com/codsen/codsen/commit/5a0a098a3dd372f6147750d161f4fea7f1f81ef4))

## 1.6.0 (2019-10-05)

### Features

- -t flag ([a9432cf](https://gitlab.com/codsen/codsen/commit/a9432cf))

## 1.5.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 1.3.0 (2018-12-26)

- Implement **atomic file write** ([b9a3c2b](https://gitlab.com/codsen/codsen/tree/master/packages/js-row-num-cli/commits/b9a3c2b))
- Improved messages when zero files found + promisified write function ([83d2bee](https://gitlab.com/codsen/codsen/tree/master/packages/js-row-num-cli/commits/83d2bee))

## 1.2.0 (2018-09-20)

- Properly set the message when there were zero files to update
- Promisified the atomic write function

## 1.1.0 (2018-09-18)

- Now file writing is done [atomically](https://github.com/npm/write-file-atomic), the write operation now cannot be interrupted or "partially" performed. Practically, this means, it will be not possible to accidentally damage the processed `.js` file there's a clash between other programs (code editors, for example) reading it. I has happened to me in the past that `.js` file accidentally gets written to be blank. No more!
- Additionally, now we have a check implemented, is the freshly-read `.js` file not blank. If it's blank, nothing is written.

## 1.0.0 (2018-07-12)

- First public release
