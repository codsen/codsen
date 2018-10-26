# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.3.0] - 2018-10-26

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## [2.2.0] - 2018-06-16

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## [2.1.0] - 2018-05-25

### Improvements

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## [2.0.0] - 2017-12-13

### Changed

- ✨ Rebased in ES Modules
- ✨ Set up Rollup. Now we serve three builds: CommonJS, UMD and ES Module.

## [1.2.0] - 2017-09-20

### Changed

- Dropped JS Standard and switched to raw ESLint on `airbnb-base` preset. Of course, with overrides to ban semicolons and allow plus-plus in loops.

## [1.1.0] - 2017-08-09

### Removed

- Replaced `object-assign` with native ES6 `Object.assign`
- We don't need `lodash.clonedeep` either, we can just Object.assign onto a empty object literal because Object.assign sources are not mutated.

## 1.0.0 - 2017-06-13

### New

- Public release

[2.3.0]: https://bitbucket.org/codsen/util-array-object-or-both/branches/compare/v2.3.0%0Dv2.2.1#diff
[2.2.0]: https://bitbucket.org/codsen/util-array-object-or-both/branches/compare/v2.2.0%0Dv2.1.0#diff
[2.1.0]: https://bitbucket.org/codsen/util-array-object-or-both/branches/compare/v2.1.0%0Dv2.0.3#diff
[2.0.0]: https://bitbucket.org/codsen/util-array-object-or-both/branches/compare/v2.0.0%0Dv1.2.2#diff
[1.2.0]: https://bitbucket.org/codsen/util-array-object-or-both/branches/compare/v1.2.0%0Dv1.1.2#diff
[1.1.0]: https://bitbucket.org/codsen/util-array-object-or-both/branches/compare/v1.1.0%0Dv1.0.8#diff
