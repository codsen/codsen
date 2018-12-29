# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.3.3](https://bitbucket.org/codsen/codsen/src/master/packages/object-set-all-values-to/compare/object-set-all-values-to@3.3.2...object-set-all-values-to@3.3.3) (2018-12-29)

**Note:** Version bump only for package object-set-all-values-to





## [3.3.2](https://bitbucket.org/codsen/codsen/src/master/packages/object-set-all-values-to/compare/object-set-all-values-to@3.3.1...object-set-all-values-to@3.3.2) (2018-12-27)

**Note:** Version bump only for package object-set-all-values-to





## 3.3.1 (2018-12-26)

**Note:** Version bump only for package object-set-all-values-to





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

# 3.0.0 (2017-12-12)

- ✨ Rebased in ES Modules
- ✨ Set up Rollup, now we generate three builds: CommonJS, UMD and ES Modules. WebPack and Rollup should recognise ES Modules build when this library is consumed as a dependency.
- ✨ Whole setup overhaul and deps update

# 2.0.0 (2017-03-16)

- Now this library does not mutate the input arguments. Yes, I know, it should have been done from the beginning, but hey, everybody's learning. This warrants a major semver bump. Otherwise, no changes in functionality.

- Unit test coverage is still solid 100%

## 1.3.0 (2017-02-17)

- Table of Contents to README

- Requesting deps version ranges more bravely, latest no matter what
- Updated company's name
- Updated BitHound config
- Added extension to CHANGELOG

## 1.2.0 (2016-12-23)

- Precommit hooks for JS Standard

## 1.1.2 (2016-12-21)

- Coverage badge

## 1.1.1 (2016-12-21)

- Now git-ignoring `.nyc_output` folder.

## 1.1.0 (2016-12-21)

- Coveralls
- Changelog

## 1.0.0 (2016-12-02)

- First public release
