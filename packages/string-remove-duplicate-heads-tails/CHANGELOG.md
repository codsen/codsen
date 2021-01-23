# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 5.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* Merge modes via opts.mergeType ([2394464](https://github.com/codsen/codsen/commit/2394464976ce1970bcd31b45d9fd9955f4bbcc09))
* prevent input opts object mutation because of arrayiffying ([e351b72](https://github.com/codsen/codsen/commit/e351b722eef2dece42f2da930ce3598305ec9b81))
* relax the API and switch to Prettier ([02d3de0](https://github.com/codsen/codsen/commit/02d3de05b451365ccdef42d55a3873c3b77a8a23))
* rewrite in TS, start using named exports ([bcdd142](https://github.com/codsen/codsen/commit/bcdd1424d3f4495bd18c95388a8ad925de6893b8))


### Performance Improvements

* remove options checking (check-types-mini) to make operations 4 times faster ([022410d](https://github.com/codsen/codsen/commit/022410da180f41ba5a5d229a3a2115cd9778fa2d))


### BREAKING CHANGES

* previously: "import remDup from ..." - now "import { remDup } from ..."
* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





## 4.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 3.0.37 (2019-10-02)

### Performance Improvements

- remove options checking (check-types-mini) to make operations 4 times faster ([1beffd4](https://gitlab.com/codsen/codsen/commit/1beffd4))

## 2.11.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 2.9.0 (2018-12-26)

- ✨ Relax the API and switch to _Prettier_ ([8aa4018](https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-duplicate-heads-tails/commits/8aa4018))

## 2.8.0 (2018-10-26)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 2.7.0 (2018-06-26)

- ✨ Updated dependencies, particularly, [string-trim-spaces-only](https://www.npmjs.com/package/string-trim-spaces-only) and others

## 2.6.0 (2018-06-20)

- ✨ Two `range-` dependencies have been renamed, namely [ranges-push](https://www.npmjs.com/package/ranges-push) and [ranges-apply](https://www.npmjs.com/package/ranges-apply). We tapped them.

## 2.5.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 2.4.0 (2018-05-16)

- ✨ Tapped dependency [string-match-left-right](https://github.com/codsen/string-match-left-right) with its new `{relaxedApi: true}` option. This prevents `throw` errors in some edge case scenarios.

## 2.3.0 (2018-05-15)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## 2.2.0 (2018-03-27)

- ✨ Relaxed the API - if the input is non-string, it's just returned back.
- ✨ Switched from raw ESLint on `airbnb-base` preset to raw ESLint and Prettier.

## 2.1.0 (2018-02-14)

- ✨ Trimming now touches only spaces. Line breaks, tabs and non-breaking spaces are not touched.

## 2.0.0 (2018-02-13)

- ✨ Rewrote the whole thing. Added more unit tests.

## 1.0.0 (2018-01-11)

- ✨ First public release
