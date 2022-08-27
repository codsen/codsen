# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.2.2](https://github.com/codsen/codsen/compare/lerna-clean-changelogs@4.2.1...lerna-clean-changelogs@4.2.2) (2022-08-27)


### Bug Fixes

* support windows CRLF line endings ([4f6195a](https://github.com/codsen/codsen/commit/4f6195a1bfa8f21f18540c90b4963f17c433980c))





# 4.2.0 (2022-08-12)

### Features

- export types ([c3e7f82](https://github.com/codsen/codsen/commit/c3e7f82300e53adef3fe2c8b3f79e74fb379d12b))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 4.1.1 (2022-04-18)

### Bug Fixes

- tweak types ([97ea400](https://github.com/codsen/codsen/commit/97ea4001c1bb6bf1a9a09d36fa2d1694f2c4d974))

# 4.1.0 (2022-04-10)

### Features

- export defaults ([4bc7c0f](https://github.com/codsen/codsen/commit/4bc7c0fd98f3c2e768df04a8e34b6465d04835d9))

# [4.0.0](https://github.com/codsen/codsen/compare/lerna-clean-changelogs@3.0.11...lerna-clean-changelogs@4.0.0) (2022-01-22)

### Bug Fixes

- set options as a plain object ([814cf09](https://github.com/codsen/codsen/commit/814cf090d14c9810b2cf6074fad316fa43d125c8)), closes [#36](https://github.com/codsen/codsen/issues/36)

### BREAKING CHANGES

- from now, the options should be set as a plain object, ie. { extras: true }

## 3.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 2.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 2.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 2.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 2.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([8c676f4](https://github.com/codsen/codsen/commit/8c676f4ea31ad71b4429d22c2bc095738562da97))

### BREAKING CHANGES

- previously you'd consume like: `import cleanChangelogs from ...` - now `import { cleanChangelogs } from ...`

## 1.5.0 (2020-11-29)

### Features

- fix for sourcehut deep links ([d3bb023](https://git.sr.ht/~royston/codsen/commit/d3bb0235c7bfe507847399544c55ae29808629ed))

## 1.4.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.3.53 (2020-04-26)

### Bug Fixes

- harden the eslint rules set and make all tests pass again ([29df39e](https://gitlab.com/codsen/codsen/commit/29df39eb787ff5b3a0636ed4ea7df6056f5a0451))

## 1.2.0 (2019-02-01)

### Features

- Set default list item format to dashes (not asterisks) to match Prettier ([16c2200](https://gitlab.com/codsen/codsen/commit/16c2200))

## 1.1.0 (2019-01-31)

### Features

- Remove excessive blank lines and convert list item bullets to asterisks ([f53d14b](https://gitlab.com/codsen/codsen/commit/f53d14b))

## 1.0.0 (2019-01-20)

- ✨ First public release
