# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 2.10.0 (2020-11-28)

### Bug Fixes

- Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))

### Features

- Add one more tag before which there will be a line break ([4f00871](https://git.sr.ht/~royston/codsen/commits/4f008715dcc2de7b2b52b67ce2e27728d5ffec37))
- Initial release ([4f35bfb](https://git.sr.ht/~royston/codsen/commits/4f35bfb167e54b1a0e5e8f01871293b262c67a76))

### Performance Improvements

- tap Array.isArray directly, speed improvements ([83cd308](https://git.sr.ht/~royston/codsen/commits/83cd30835cce3892ecce59e348aadee830ba5294))

## 2.9.44 (2019-10-02)

### Performance Improvements

- tap Array.isArray directly, speed improvements ([83cd308](https://gitlab.com/codsen/codsen/commit/83cd308))

## 2.9.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 2.3.0 (2018-10-26)

- ✨ Update all dependencies
- ✨ Restore coveralls.io reporting
- ✨ Restore unit test linting

## 2.2.0 (2018-07-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 2.1.0 (2018-05-25)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 2.0.0 (2017-11-09)

- ✨ Numbers are not correctly reported as "non-empty"
- ✨ Some rebasing and improvements to the setup

## 1.4.0 (2017-09-23)

- ✨ Implemented Rollup to generate 3 flavours of this package: CommonJS, UMD and ESM `module` with `import`/`export`

## 1.3.0 (2017-09-18)

- ✨ Add this changelog
- ✨ Switched from JS Standard to ESLint on `airbnb-base` preset. It's way better

## 1.0.0 (2016-12-23)

- ✨ First public release
