# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.8](https://github.com/codsen/codsen/compare/object-set-all-values-to@4.0.7...object-set-all-values-to@4.0.8) (2021-03-14)

**Note:** Version bump only for package object-set-all-values-to





## 4.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 4.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([deccbb2](https://github.com/codsen/codsen/commit/deccbb209e7561f9041677f61f2e11919d91696b))

### BREAKING CHANGES

- previously: `import setAllValuesTo from ...` - now `import { setAllValuesTo } from ...`

## 3.10.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 3.9.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 3.3.0 (2018-10-24)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 3.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 3.1.0 (2018-05-26)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 3.0.0 (2017-12-12)

- ✨ Rebased in ES Modules
- ✨ Set up Rollup, now we generate three builds: CommonJS, UMD and ES Modules. WebPack and Rollup should recognise ES Modules build when this library is consumed as a dependency.
- ✨ Whole setup overhaul and deps update

## 2.0.0 (2017-03-16)

- ✨ Now, this library does not mutate the input arguments. Yes, I know, it should have been done from the beginning, but hey, everybody's learning. This warrants a major semver bump. Otherwise, no changes in functionality.

## 1.3.0 (2017-02-17)

- ✨ Add Table of Contents to README
- ✨ Requesting deps version ranges more bravely, latest no matter what
- ✨ Updated company's name
- ✨ Updated BitHound config
- ✨ Added extension to CHANGELOG

## 1.2.0 (2016-12-23)

- ✨ Add precommit hooks for JS Standard

## 1.1.2 (2016-12-21)

- ✨ Add coverage badge

## 1.1.1 (2016-12-21)

- ✨ Now git-ignoring `.nyc_output` folder.

## 1.1.0 (2016-12-21)

- ✨ Add coveralls
- ✨ Add this changelog

## 1.0.0 (2016-12-02)

- ✨ First public release
