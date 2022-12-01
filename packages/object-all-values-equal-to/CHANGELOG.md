# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2022-12-01)

### Features

- drop Node v12 support; minimum version requirement now is v14.18 and above ([c8049e8](https://github.com/codsen/codsen/commit/c8049e82a5844d3f72587740f1cc74e3c9020d22))

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

# 3.2.0 (2022-08-12)

### Features

- export types ([b186d39](https://github.com/codsen/codsen/commit/b186d39d259006fb7a0a4c267174200259930974))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 3.1.2 (2022-04-18)

### Fixed

- tweak types ([01f5c07](https://github.com/codsen/codsen/commit/01f5c07ce25fc641300f11028e6420889b46e1b5))

# 3.1.0 (2022-04-10)

### Features

- export defaults ([89a0431](https://github.com/codsen/codsen/commit/89a0431b38f2b523a4d9da12ecb4264620bb646e))

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

- rewrite in TS, start using named exports ([4190a84](https://github.com/codsen/codsen/commit/4190a849df5ed2c76fc08e44199cfb41bee45857))

### BREAKING CHANGES

- previously: `import allEq from ...` - now `import { allEq } from ...`

## 1.9.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.8.0 (2019-10-02)

### Features

- remove option checking to make things run faster ([296989f](https://gitlab.com/codsen/codsen/commit/296989f))

## 1.7.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 1.3.0 (2018-10-24)

- Updated all dependencies
- Restored coveralls.io reporting
- Restored unit test linting

## 1.2.0 (2018-06-19)

GitHub sold us out. In the meantime, we:

- Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis

## 1.1.0 (2018-05-21)

- Set up [Prettier](https://prettier.io)
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- Now pointing unit tests at ES Modules build, not CommonJS-one. This means, unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.

## 1.0.0 (2017-12-13)

- First public release
