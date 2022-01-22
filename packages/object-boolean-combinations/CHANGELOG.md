# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.0.12](https://github.com/codsen/codsen/compare/object-boolean-combinations@5.0.11...object-boolean-combinations@5.0.12) (2022-01-22)

**Note:** Version bump only for package object-boolean-combinations





## 5.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 4.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 4.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 4.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 4.0.0 (2021-01-23)

### Features

- recode in TS and start using named exports ([75d5dc0](https://github.com/codsen/codsen/commit/75d5dc0419303284006b88e6fcbe4a2d9b2e6faf))

### BREAKING CHANGES

- previously default was exported: `import combinations from ...` - now use named export `import { combinations } from ...`

## 3.0.0 (2020-12-06)

### BREAKING CHANGES

- now all combinations' values are booleans, no more digits `0` or `1` ([dbb2f05](https://git.sr.ht/~royston/codsen/commit/dbb2f05129e0e8b7b95593c6cc19b8ebd859ecad)). Type safety, you know.

## 2.12.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.11.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 2.5.0 (2018-12-26)

- ✨ Allow any types in override object key values ([af4f99d](https://gitlab.com/codsen/codsen/tree/master/packages/object-boolean-combinations/commits/af4f99d))

## 2.4.0 (2018-10-24)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 2.3.0 (2018-07-25)

- ✨ Allow override object key values to be of any type
- ✨ Small improvements to the setup

## 2.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 2.1.0 (2018-05-17)

### Changed

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rules, dropped `airbnb-base`
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Now unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## 2.0.0 (2017-12-12)

### Changed

- ✨ Rebased the source in ES Modules
- ✨ Set up Rollup and now we are generating three builds: CommonJS, UMD and ES Modules (native code).
- ✨ Small tweaks to the code, no changes to the API.

**PS. Bumping the major version just in case it breaks something. But it should not.**
