# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 5.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 4.1.2 (2022-09-05)

### Fixed

- address memory leaks related to arrays not being garbage-collected ([7001193](https://github.com/codsen/codsen/commit/7001193ba3f6eec5015b5f1199f6ae296ae31204))

## 4.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 4.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 3.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 3.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 3.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 3.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([5b05e0c](https://github.com/codsen/codsen/commit/5b05e0c8e2be7d24cfee72393303ffd7572dcac1))

### BREAKING CHANGES

- previously, you'd consume like: `import isLangCode from ...` - now `import { isLangCode } from ...`

## 2.0.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.0.0 (2020-01-05)

### Features

- init ([00776db](https://gitlab.com/codsen/codsen/commit/00776db3a81ecd9a683580fd459a756c462338f5))

### BREAKING CHANGES

- init

## 1.0.0 (2020-01-05)

- First public release
