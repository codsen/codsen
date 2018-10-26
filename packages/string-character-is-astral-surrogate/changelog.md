# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2018-10-25

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## [1.3.0] - 2018-06-16

- ✨ Tweaks to the setup: added comment removal during Rollup build and dependency updates

## [1.2.0] - 2018-06-16

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## [1.1.0] - 2018-05-26

### Improvements

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 1.0.0 - 2018-03-01

### New

- ✨ First public release

[1.1.0]: https://bitbucket.org/codsen/string-character-is-astral-surrogate/branches/compare/v1.1.0%0Dv1.0.1#diff
[1.2.0]: https://bitbucket.org/codsen/string-character-is-astral-surrogate/branches/compare/v1.2.0%0Dv1.1.0#diff
[1.3.0]: https://bitbucket.org/codsen/string-character-is-astral-surrogate/branches/compare/v1.3.0%0Dv1.2.1#diff
[1.4.0]: https://bitbucket.org/codsen/string-character-is-astral-surrogate/branches/compare/v1.4.0%0Dv1.3.0#diff
