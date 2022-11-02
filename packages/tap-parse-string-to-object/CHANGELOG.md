# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.1.5](https://github.com/codsen/codsen/compare/tap-parse-string-to-object@3.1.4...tap-parse-string-to-object@3.1.5) (2022-11-02)

**Note:** Version bump only for package tap-parse-string-to-object

# 3.1.0 (2022-08-12)

### Features

- export types ([9ad65cb](https://github.com/codsen/codsen/commit/9ad65cb0b57ce86fecdd96db2a726571c191fe3c))
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

- rewrite in TS, start using named exports, stop producing UMD builds ([6d54b6b](https://github.com/codsen/codsen/commit/6d54b6b53f72db13c677701d42d65170bf53583e))

### BREAKING CHANGES

- previously: `import parseTap from ...` - now `import { parseTap } from ...`

## 1.3.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.2.0 (2019-12-14)

### Features

- recognise raw tap with single suite, no curlies ([d7daf96](https://gitlab.com/codsen/codsen/commit/d7daf96e62661022b2bdee00e0ae5029d9c697b6))
- support stream inputs, in which case, return promise of an object ([70a34cf](https://gitlab.com/codsen/codsen/commit/70a34cf6c07c5674b7f20f723ba0b098ffa3a9b1))

## 1.1.0 (2019-12-09)

### Features

- init ([be118a3](https://gitlab.com/codsen/codsen/commit/be118a3fe66f84b19425571dd2da76d3d4e86fa1))

## Change Log

## 1.0.0 (2019-12-08)

- First public release
