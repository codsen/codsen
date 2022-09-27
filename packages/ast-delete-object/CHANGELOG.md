# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.1.4](https://github.com/codsen/codsen/compare/ast-delete-object@3.1.3...ast-delete-object@3.1.4) (2022-09-27)

**Note:** Version bump only for package ast-delete-object





# 3.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 3.0.16 (2022-04-18)

### Bug Fixes

- tweak types ([826cdf4](https://github.com/codsen/codsen/commit/826cdf4e4a59dd6245bcf31129f7e9e999851776))

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

- rewrite in TS and start using named exports ([78e380e](https://github.com/codsen/codsen/commit/78e380eee3bcb8cdf20de44f9ceca5a05347fc65))

### BREAKING CHANGES

- previously you'd import like: `import deleteObj from ...` - now `import { deleteObj } from ...`

## 1.10.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.9.0 (2020-09-24)

### Features

- add examples ([f628a2f](https://gitlab.com/codsen/codsen/commit/f628a2f5d66dbba77845498d58a5be572b33a624))

## 1.8.63 (2020-04-26)

### Bug Fixes

- harden the eslint rules set, make all tests pass and rebase a little ([c84365e](https://gitlab.com/codsen/codsen/commit/c84365e8aa37ce253d5b6a0a700128db6ee2a3fb))

## 1.8.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.4.0 (2018-10-13)

- ✨ Updated all dependencies and restored coverage tracking both via terminal when testing and through coveralls.io

## 1.3.0 (2018-06-13)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 1.2.0 (2018-05-14)

### Improved

- ✨ Now pointing unit tests at ES Modules build, not CommonJS-one. This means, unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.
- ✨ Tweaks to ava [config](https://github.com/avajs/ava/blob/master/docs/recipes/es-modules.md) in `package.json`, properly enabling the `dev` Rollup builds.

## 1.1.0 (2018-05-01)

### Added

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## 1.0.0 (2018-03-11)

- ✨ First public release
