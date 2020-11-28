# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 3.14.0 (2020-11-28)

### Bug Fixes

- Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))

### Features

- Add one more tag before which there will be a line break ([4f00871](https://git.sr.ht/~royston/codsen/commits/4f008715dcc2de7b2b52b67ce2e27728d5ffec37))
- discard any nulls among the ranges ([5f86fbc](https://git.sr.ht/~royston/codsen/commits/5f86fbcb0989fe3e2f7b19ffd9665b2725266e89))
- don't throw error if input is not array or it's empty - just quickly return it ([e169a87](https://git.sr.ht/~royston/codsen/commits/e169a8747c3a98411d8e7923af334ddc1c6b1fe1))
- Initial release ([4f35bfb](https://git.sr.ht/~royston/codsen/commits/4f35bfb167e54b1a0e5e8f01871293b262c67a76))
- opts.progressFn ([09de99c](https://git.sr.ht/~royston/codsen/commits/09de99ca38e3b2127d59681bce599671c8f7973a))
- remove all dependencies ([3c8fda8](https://git.sr.ht/~royston/codsen/commits/3c8fda875584044b54a3f27e7406b71881f3b6a6))

### Performance Improvements

- remove orginal number package and check-types-mini, make 165 times faster ([6e995c5](https://git.sr.ht/~royston/codsen/commits/6e995c590e68aad32d68960e76194ce9f4b847bb))

## 3.13.0 (2020-09-07)

### Features

- discard any nulls among the ranges ([5f86fbc](https://gitlab.com/codsen/codsen/commit/5f86fbcb0989fe3e2f7b19ffd9665b2725266e89))

## 3.12.0 (2020-05-24)

### Features

- don't throw error if input is not array or it's empty - just quickly return it ([e169a87](https://gitlab.com/codsen/codsen/commit/e169a8747c3a98411d8e7923af334ddc1c6b1fe1))

## 3.11.0 (2020-02-01)

### Features

- remove all dependencies ([3c8fda8](https://gitlab.com/codsen/codsen/commit/3c8fda875584044b54a3f27e7406b71881f3b6a6))

## 3.10.39 (2019-10-02)

### Performance Improvements

- remove orginal number package and check-types-mini, make 165 times faster ([6e995c5](https://gitlab.com/codsen/codsen/commit/6e995c5))

## 3.10.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 3.6.0 (2018-12-26)

- ✨ Add `opts.progressFn` ([09de99c](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-sort/commits/09de99c))

## 3.5.0 (2018-11-29)

- ✨ Add `opts.progressFn` - if you pass a function, it will report the progress, calling that function with a number between `0` and `100`. It's not precise and meant to be used as an approximate progress indicator.

## 3.4.0 (2018-10-25)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 3.3.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 3.2.0 (2018-05-26)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 3.1.0 (2018-01-10)

- ✨ Updated all dependencies and setup in general

## 3.0.0 (2017-12-03)

- ✨ Set up Rollup, generating three builds: CommonJS, UMD and ES Modules
- ✨ Rebase the code to be natively in ES Modules

**PS. Bumping major just in case this breaks API endpoints.**

## 2.1.0 (2017-09-13)

- ✨ Add more description in readme
- ✨ Add more unit tests, including tests for examples used in readme

## 2.0.0 (2017-09-12)

- ✨ Add `opts.strictlyTwoElementsInRangeArrays` (default is `false`, differently from v1 which is opposite)

## 1.0.0 (2017-09-11)

- ✨ Initial release
