# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.5](https://github.com/codsen/codsen/compare/string-apostrophes@4.0.4...string-apostrophes@4.0.5) (2022-12-27)

**Note:** Version bump only for package string-apostrophes

## 4.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 3.1.0 (2022-08-12)

### Features

- export types ([326f8cc](https://github.com/codsen/codsen/commit/326f8ccece26c256a0add81cc1371a2308cfcfc0))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 3.0.0 (2022-04-28)

### Fixed

- set correct defaults ([cfb61e2](https://github.com/codsen/codsen/commit/cfb61e2a3179dfe8b485ba0100efaebcfcde7f48))

### BREAKING CHANGES

- now convertOne() option `opts.convertEntities` default is false (it was wrongly true
  before)

## 2.1.0 (2022-04-11)

### Features

- export `defaults` and `version` ([1107244](https://github.com/codsen/codsen/commit/1107244b45eff96ac1fc4ab992031ede0d10ba8c))

## 2.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 1.5.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 1.4.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 1.4.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 1.4.0 (2021-01-23)

### Features

- rewrite in TS ([378fd95](https://github.com/codsen/codsen/commit/378fd95784aab8dc2d10daa4a1811b182c618a9a))

## 1.2.0 (2019-10-02)

### Features

- don't convert single apostrophe or double apostrophe if there's nothing around it ([5d940b3](https://gitlab.com/codsen/codsen/commit/5d940b3))
- explicit settings which decode if options are off ([4f1117a](https://gitlab.com/codsen/codsen/commit/4f1117a))

## 1.1.0 (2019-09-11)

### Features

- initial release ([04861c2](https://gitlab.com/codsen/codsen/commit/04861c2))

## 1.0.0 (2019-09-06)

- First public release
