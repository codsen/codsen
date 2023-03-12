# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 6.0.4 (2023-03-12)

**Note:** Version bump only for package html-all-known-attributes

## 6.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 5.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

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

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 4.0.0 (2021-01-23)

### Features

- rewrite in TS ([7130bce](https://github.com/codsen/codsen/commit/7130bcea11e81cf7e59c2127eae10e302e461e11)), start using named exports

### BREAKING CHANGES

- previously you'd consume like: `import allHtmlAttribs from ...` — now: `import { allHtmlAttribs } from ...`

## 3.0.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 2.0.0 (2020-04-13)

### Features

- export Set instead of Array and remove JSON source file ([d09e5b7](https://gitlab.com/codsen/codsen/commit/d09e5b7a592ef7b2bd5faef0eef0f7a78038a74f))

### BREAKING CHANGES

- For perf reasons, export Set instead of Array and remove JSON source file

## 1.3.0 (2020-01-05)

### Features

- add xmlns ([7154f5f](https://gitlab.com/codsen/codsen/commit/7154f5f29f3cdc16a8a561eb5724b537300366d4))

## 1.2.0 (2020-01-01)

### Features

- add two html attributes used in edialog tracking links in emails ([4644703](https://gitlab.com/codsen/codsen/commit/46447036e0bfdb5c5357ae510e6ac0e0dce6db75))

## 1.1.0 (2019-12-27)

### Features

- init ([2b332dd](https://gitlab.com/codsen/codsen/commit/2b332dd351aabfe6e284f50eba9a8b45471fbcd3))

## 1.0.0 (2019-12-25)

- First public release
