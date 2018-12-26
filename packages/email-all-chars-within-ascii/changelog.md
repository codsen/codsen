## [2.4.0] (2018-10-17)

- ✨ Updated all dependencies
- ✨ Restored unit test coverage tracking: reporting in terminal and coveralls.io
- ✨ Restored unit test linting

## [2.3.0] (2018-06-26)

- ✨ Set up Rollup to remove all comments from built files
- ✨ There was a strange bug in Rollup UMD builds where `undefined` literals were being renamed that caused _throws_ when trying to use UMD builds. What makes things worse, I'm not using UMD builds and all unit tests are pointing to ES Modules build, so, theoretically, if Rollup messed up UMD builds there was no automated way to tell. Now, UMD build should be working correctly. Sorry everybody who got affected.

## [2.2.0] (2018-06-15)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## [2.1.0] (2018-05-26)

### Improvements

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

# [2.0.0] (2017-12-05)

### Added

- ✨ Rebased in ES modules
- ✨ Set up Rollup (nice ryming) to serve CommonJS, UMD and ES Module builds
- ✨ Refreshed all deps
- ✨ Edited readme a bit

Bumping major just in case somebody's API breaks. But it should not break.

## [1.3.0] (2017-09-19)

### Changed

- 🔧 Switching to raw ESLint with `airbnb-base` config with no-semicolons override. For posterity, JS Standard sucks - it's neglected by maintainers (consumes half-year-old version of ESLint), it's flagged as insecure by BitHound (because of `shell.js` two levels deep in dependencies) and doesn't have as much rules active as `airbnb` presets.

## [1.2.0] (2017-09-04)

### New

- ✨ `opts.checkLineLength` will throw is lines are more than 999 chars in length. See the [SMTP spec](https://tools.ietf.org/html/rfc821).

## [1.1.0] (2017-08-27)

### New

- ✨ `opts.messageOnly` throws only a message. Used in [CLI](https://bitbucket.org/codsen/email-all-chars-within-ascii-cli/) version of this lib.

## 1.0.0 - 2017-08-24

### New

- ✨ First public release

[1.1.0]: https://bitbucket.org/codsen/email-all-chars-within-ascii/branches/compare/v1.1.0%0Dv1.0.3#diff
[1.2.0]: https://bitbucket.org/codsen/email-all-chars-within-ascii/branches/compare/v1.2.0%0Dv1.1.1#diff
[1.3.0]: https://bitbucket.org/codsen/email-all-chars-within-ascii/branches/compare/v1.3.0%0Dv1.2.0#diff
[2.0.0]: https://bitbucket.org/codsen/email-all-chars-within-ascii/branches/compare/v2.0.0%0Dv1.3.0#diff
[2.1.0]: https://bitbucket.org/codsen/email-all-chars-within-ascii/branches/compare/v2.1.0%0Dv2.0.4#diff
[2.2.0]: https://bitbucket.org/codsen/email-all-chars-within-ascii/branches/compare/v2.2.0%0Dv2.1.0#diff
[2.3.0]: https://bitbucket.org/codsen/email-all-chars-within-ascii/branches/compare/v2.3.0%0Dv2.2.1#diff
[2.4.0]: https://bitbucket.org/codsen/email-all-chars-within-ascii/branches/compare/v2.4.0%0Dv2.3.0#diff
