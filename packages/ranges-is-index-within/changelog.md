# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.6.0] - 2018-06-16

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## [1.5.0] - 2018-05-11

Setup refresh. Plus:

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## [1.4.0] - 2018-02-06

- ✨ `opts.skipIncomingRangeSorting`

## [1.3.0] - 2018-01-10

- ✨ `opts.returnMatchedRangeInsteadOfTrue`

## [1.2.0] - 2017-11-29

- ✨ Set up Rollup and now we generate three builds: CommonJS, UMD and ES Modules.
- ✨ Rebased the source to be in ES Modules.

## [1.1.0] - 2017-09-13

- ✨ If any of the ranges has starting index bigger than ending (like `[2, 1]`), it does not make sense and program will `throw`.
- ✨ Even more unit tests. It does not matter that there's 100% coverage, the more the better, especially testing edge cases.

## 1.0.0 - 2017-09-13

- ✨ Initial release

[1.1.0]: https://bitbucket.org/codsen/ranges-is-index-within/branches/compare/v1.1.0%0Dv1.0.1#diff
[1.2.0]: https://bitbucket.org/codsen/ranges-is-index-within/branches/compare/v1.2.0%0Dv1.1.0#diff
[1.3.0]: https://bitbucket.org/codsen/ranges-is-index-within/branches/compare/v1.3.0%0Dv1.2.2#diff
[1.4.0]: https://bitbucket.org/codsen/ranges-is-index-within/branches/compare/v1.4.0%0Dv1.3.1#diff
[1.5.0]: https://bitbucket.org/codsen/ranges-is-index-within/branches/compare/v1.5.0%0Dv1.4.1#diff
[1.6.0]: https://bitbucket.org/codsen/ranges-is-index-within/branches/compare/v1.6.0%0Dv1.5.2#diff
