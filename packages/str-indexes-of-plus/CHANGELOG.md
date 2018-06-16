# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.2.0] - 2018-06-16

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## [2.1.0] - 2018-05-26

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## [2.0.0] - 2017-12-03

- ✨ Rebased the source to be in ES modules
- ✨ Set up Rollup to generate three flavours: CommonJS, UMD and native ES Modules (source)
- ✨ Removed JS Standard because it's a wrapper and therefore it sucks. Switched to raw ESLint on `airbnb-base` preset and turned off semicolons. Fixed all newly-found issues.
- ✨ Updated many other files including readme.

## 1.0.0 - 2017-03-23

- ✨ First public release

[2.0.0]: https://bitbucket.org/codsen/str-indexes-of-plus/branches/compare/v2.0.0%0Dv1.0.3#diff
[2.1.0]: https://bitbucket.org/codsen/str-indexes-of-plus/branches/compare/v2.1.0%0Dv2.0.5#diff
[2.2.0]: https://bitbucket.org/codsen/str-indexes-of-plus/branches/compare/v2.2.0%0Dv2.1.0#diff
