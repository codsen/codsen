# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* complete rewrite - return objects for each bad character or exceeding of max line length ([95b6cf4](https://github.com/codsen/codsen/commit/95b6cf49ed4ed0b619568d6a9841eb4e6297aab3))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* opts.messageOnly ([a147216](https://github.com/codsen/codsen/commit/a147216b204866b6a68f00448ef68187765e3988))
* return UTF32Hex value too ([6db600a](https://github.com/codsen/codsen/commit/6db600a1a1cc926f5014181b05d0c2740a660deb))


### Performance Improvements

* remove check-types-mini ([199bd63](https://github.com/codsen/codsen/commit/199bd635496adf1051b7d14aa7d8fd49f9014bdc))


### BREAKING CHANGES

* 1. no more default exported. Import like "import { within } from ...". 2. array of
errors - plain objects - is now returned. See examples.





## 2.10.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.9.45 (2019-10-05)

### Performance Improvements

- remove check-types-mini ([a76b12d](https://gitlab.com/codsen/codsen/commit/a76b12d))

## 2.9.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 2.5.0 (2018-12-26)

- ✨ Added `opts.messageOnly` ([d20b191](https://gitlab.com/codsen/codsen/tree/master/packages/email-all-chars-within-ascii/commits/d20b191))

## 2.4.0 (2018-10-17)

- ✨ Updated all dependencies
- ✨ Restored unit test coverage tracking: reporting in terminal and coveralls.io
- ✨ Restored unit test linting

## 2.3.0 (2018-06-26)

- ✨ Set up Rollup to remove all comments from built files
- ✨ There was a strange bug in Rollup UMD builds where `undefined` literals were being renamed that caused _throws_ when trying to use UMD builds. What makes things worse, I'm not using UMD builds and all unit tests are pointing to ES Modules build, so, theoretically, if Rollup messed up UMD builds there was no automated way to tell. Now, UMD build should be working correctly. Sorry everybody who got affected.

## 2.2.0 (2018-06-15)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 2.1.0 (2018-05-26)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 2.0.0 (2017-12-05)

- ✨ Rebased in ES modules
- ✨ Set up Rollup (nice ryming) to serve CommonJS, UMD and ES Module builds
- ✨ Refreshed all deps
- ✨ Edited readme a bit

**PS.** Bumping major just in case somebody's API breaks. But it should not break.

## 1.3.0 (2017-09-19)

- 🔧 Switching to raw ESLint with `airbnb-base` config with no-semicolons override. For posterity, JS Standard sucks - it's neglected by maintainers (consumes half-year-old version of ESLint), it's flagged as insecure by BitHound (because of `shell.js` two levels deep in dependencies) and doesn't have as much rules active as `airbnb` presets.

## 1.2.0 (2017-09-04)

- ✨ `opts.checkLineLength` will throw is lines are more than 999 chars in length. See the [SMTP spec](https://tools.ietf.org/html/rfc821).

## 1.1.0 (2017-08-27)

- ✨ `opts.messageOnly` throws only a message. Used in CLI ([npm](https://www.npmjs.com/package/email-all-chars-within-ascii-cli), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/email-all-chars-within-ascii-cli)) version of this lib.

## 1.0.0 (2017-08-24)

- ✨ First public release
