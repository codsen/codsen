# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.6.3](https://bitbucket.org/codsen/codsen/src/master/packages/object-flatten-all-arrays/compare/object-flatten-all-arrays@4.6.2...object-flatten-all-arrays@4.6.3) (2019-01-16)

**Note:** Version bump only for package object-flatten-all-arrays





## [4.6.2](https://bitbucket.org/codsen/codsen/src/master/packages/object-flatten-all-arrays/compare/object-flatten-all-arrays@4.6.1...object-flatten-all-arrays@4.6.2) (2019-01-15)

**Note:** Version bump only for package object-flatten-all-arrays

## [4.6.1](https://bitbucket.org/codsen/codsen/src/master/packages/object-flatten-all-arrays/compare/object-flatten-all-arrays@4.6.0...object-flatten-all-arrays@4.6.1) (2019-01-13)

**Note:** Version bump only for package object-flatten-all-arrays

# [4.6.0](https://bitbucket.org/codsen/codsen/src/master/packages/object-flatten-all-arrays/compare/object-flatten-all-arrays@4.3.7...object-flatten-all-arrays@4.6.0) (2019-01-11)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/object-flatten-all-arrays/commits/4f00871))

# [4.5.0](https://bitbucket.org/codsen/codsen/src/master/packages/object-flatten-all-arrays/compare/object-flatten-all-arrays@4.3.7...object-flatten-all-arrays@4.5.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/object-flatten-all-arrays/commits/4f00871))

# [4.4.0](https://bitbucket.org/codsen/codsen/src/master/packages/object-flatten-all-arrays/compare/object-flatten-all-arrays@4.3.7...object-flatten-all-arrays@4.4.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/object-flatten-all-arrays/commits/4f00871))

## [4.3.7](https://bitbucket.org/codsen/codsen/src/master/packages/object-flatten-all-arrays/compare/object-flatten-all-arrays@4.3.6...object-flatten-all-arrays@4.3.7) (2019-01-02)

**Note:** Version bump only for package object-flatten-all-arrays

## [4.3.6](https://bitbucket.org/codsen/codsen/src/master/packages/object-flatten-all-arrays/compare/object-flatten-all-arrays@4.3.5...object-flatten-all-arrays@4.3.6) (2019-01-01)

**Note:** Version bump only for package object-flatten-all-arrays

## [4.3.5](https://bitbucket.org/codsen/codsen/src/master/packages/object-flatten-all-arrays/compare/object-flatten-all-arrays@4.3.4...object-flatten-all-arrays@4.3.5) (2018-12-29)

**Note:** Version bump only for package object-flatten-all-arrays

## [4.3.4](https://bitbucket.org/codsen/codsen/src/master/packages/object-flatten-all-arrays/compare/object-flatten-all-arrays@4.3.3...object-flatten-all-arrays@4.3.4) (2018-12-29)

**Note:** Version bump only for package object-flatten-all-arrays

## [4.3.3](https://bitbucket.org/codsen/codsen/src/master/packages/object-flatten-all-arrays/compare/object-flatten-all-arrays@4.3.2...object-flatten-all-arrays@4.3.3) (2018-12-27)

**Note:** Version bump only for package object-flatten-all-arrays

## [4.3.2](https://bitbucket.org/codsen/codsen/src/master/packages/object-flatten-all-arrays/compare/object-flatten-all-arrays@4.3.1...object-flatten-all-arrays@4.3.2) (2018-12-27)

**Note:** Version bump only for package object-flatten-all-arrays

## 4.3.1 (2018-12-26)

**Note:** Version bump only for package object-flatten-all-arrays

## 4.3.0 (2018-10-24)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 4.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 4.1.0 (2018-05-26)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

# 4.0.0 (2017-12-12)

- ✨ Rebased in ES Modules
- ✨ Set up Rollup. Now we generate three builds: CommonJS, UMD and ES Modules.
- ✨ Major setup overhaul and deps refresh.

## 3.1.0 (2017-05-12)

- ✨ `opts.flattenArraysContainingStringsToBeEmpty` now lets you flatten object values which have arrays which have strings into empty arrays. This is important. Trust me. No, seriously.

## 3.0.0 (2017-03-17)

- ✨ Recoded all the core, improving the algorithm and making everything cleaner (hope so).
- ✨ Pinned JS Standard not to be the latest, to avoid sudden linting issues coming from nowhere and blocking builds when a new version of JS Standard is released.
- ✨ Even more tests.
- ✨ Unit test coverage is still a solid 100%.
