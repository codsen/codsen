# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 6.0.30 (2025-10-08)

**Note:** Version bump only for package object-set-all-values-to

## 6.0.16 (2024-03-30)

### Bug Fixes

- tweak types ([5ea026a](https://github.com/codsen/codsen/commit/5ea026ae62cdb8fa0a86e578bfde368d653959c2))

## 6.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 5.1.0 (2022-08-12)

### Features

- export types ([46af5bb](https://github.com/codsen/codsen/commit/46af5bb82513ffa82618c120a523ed53d51a5496))
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

- rewrite in TS, start using named exports ([deccbb2](https://github.com/codsen/codsen/commit/deccbb209e7561f9041677f61f2e11919d91696b))

### BREAKING CHANGES

- previously: `import setAllValuesTo from ...` - now `import { setAllValuesTo } from ...`

## 3.10.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 3.9.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 3.3.0 (2018-10-24)

- Updated all dependencies
- Restored coveralls.io reporting
- Restored unit test linting

## 3.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis

## 3.1.0 (2018-05-26)

- Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 3.0.0 (2017-12-12)

- Rebased in ES Modules
- Set up Rollup, now we generate three builds: CommonJS, UMD and ES Modules. WebPack and Rollup should recognise ES Modules build when this library is consumed as a dependency.
- Whole setup overhaul and deps update

## 2.0.0 (2017-03-16)

- Now, this library does not mutate the input arguments. Yes, I know, it should have been done from the beginning, but hey, everybody's learning. This warrants a major semver bump. Otherwise, no changes in functionality.

## 1.3.0 (2017-02-17)

- Add Table of Contents to README
- Requesting deps version ranges more bravely, latest no matter what
- Updated company's name
- Updated BitHound config
- Added extension to CHANGELOG

## 1.2.0 (2016-12-23)

- Add precommit hooks for JS Standard

## 1.1.2 (2016-12-21)

- Add coverage badge

## 1.1.1 (2016-12-21)

- Now git-ignoring `.nyc_output` folder.

## 1.1.0 (2016-12-21)

- Add coveralls
- Add this changelog

## 1.0.0 (2016-12-02)

- First public release
