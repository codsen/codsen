# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2022-12-01)

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

- rewrite in TS and start using named exports ([2e263be](https://github.com/codsen/codsen/commit/2e263be6dc7bf879cc27c97d2e95460cf85011f5))

### BREAKING CHANGES

- previously you'd consume like: `import generateAst from ...` — now `import { generateAst } from ...`

## 1.10.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.9.0 (2019-06-29)

### Features

- Add perf checking, recording and historic comparison ([173308e](https://gitlab.com/codsen/codsen/commit/173308e))

## 1.8.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 1.4.0 (2018-12-14)

- Updated all dependencies and restored AVA linting, added licence to the top of each built file

## 1.3.0 (2018-10-12)

- Updated all dependencies and restored coverage reporting both in terminal and sending to coveralls

## 1.2.0 (2018-05-11)

- Pointed AVA unit tests to ES Modules build, as opposed to previously transpiled CommonJS-one. This means, now unit test code coverage is correct.

## 1.1.0 (2018-04-29)

- Setup refresh and dependency updates: deleted `package-lock.json` and `.editorconfig`

## 1.0.0 (2018-03-31)

- Public release
