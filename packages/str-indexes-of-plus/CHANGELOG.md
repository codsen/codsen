# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.11.0 (2020-11-28)


### Bug Fixes

* Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))


### Features

* Add one more tag before which there will be a line break ([4f00871](https://git.sr.ht/~royston/codsen/commits/4f008715dcc2de7b2b52b67ce2e27728d5ffec37))
* Initial release ([4f35bfb](https://git.sr.ht/~royston/codsen/commits/4f35bfb167e54b1a0e5e8f01871293b262c67a76))
* remove the last dependency ([d2e66d1](https://git.sr.ht/~royston/codsen/commits/d2e66d1c7c82bbf18cf2d4e4c01d4299f75092ce))





## 2.10.0 (2020-02-01)

### Features

- remove the last dependency ([d2e66d1](https://gitlab.com/codsen/codsen/commit/d2e66d1c7c82bbf18cf2d4e4c01d4299f75092ce))

## 2.9.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 2.3.0 (2018-10-25)

- ✨ Update all dependencies
- ✨ Restore coveralls.io reporting
- ✨ Restore unit test linting

## 2.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 2.1.0 (2018-05-26)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 2.0.0 (2017-12-03)

- ✨ Rebased the source to be in ES modules
- ✨ Set up Rollup to generate three flavours: CommonJS, UMD and native ES Modules (source)
- ✨ Removed JS Standard because it's a wrapper and therefore it sucks. Switched to raw ESLint on `airbnb-base` preset and turned off semicolons. Fixed all newly-found issues.
- ✨ Updated many other files including readme.

## 1.0.0 (2017-03-23)

- ✨ First public release
