# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.0.7](https://github.com/codsen/codsen/compare/gulp-email-remove-unused-css@5.0.6...gulp-email-remove-unused-css@5.0.7) (2023-02-04)

**Note:** Version bump only for package gulp-email-remove-unused-css

## 5.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 4.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 4.0.3 (2021-11-02)

### Features

- migrate to ES Modules ([c579dff](https://github.com/codsen/codsen/commit/c579dff3b23205e383035ca10ddcec671e35d0fe))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 4.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 3.9.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 3.8.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 3.8.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 3.6.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 3.5.0 (2019-01-08)

- 🔧 The main API dependency `email-remove-unused-css` was renamed to `email-comb` so we switched to latter
- 🔧 Replaced `gulp-util` with `plugin-error`
- Added a dummy unit test to keep the build scripts consistent
