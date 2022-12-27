# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.6](https://github.com/codsen/codsen/compare/ast-is-empty@4.0.5...ast-is-empty@4.0.6) (2022-12-27)

**Note:** Version bump only for package ast-is-empty

## 4.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 3.1.0 (2022-08-12)

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

- rewrite in TS, use named exports ([5773b6a](https://github.com/codsen/codsen/commit/5773b6a537430de2cb1fd1308bf97e57a359ccc5))

### BREAKING CHANGES

- previously: `import isEmpty from ...` - now `import { isEmpty } from ...`

## 1.11.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.10.0 (2020-02-01)

### Features

- remove the last and only dependency ([e06e6ae](https://gitlab.com/codsen/codsen/commit/e06e6ae009de22a1a37830c8d14dfdf5686a0834))

## 1.9.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 1.3.0 (2018-10-13)

- Updated all dependencies and restored coverage tracking both via terminal when testing and through coveralls.io

## 1.2.0 (2018-06-13)

GitHub sold us out. In the meantime, we:

- Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis

## 1.1.0 (2018-05-02)

- Set up [Prettier](https://prettier.io)
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## 1.0.0 (2018-03-11)

- First public release.
