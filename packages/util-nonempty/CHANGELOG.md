# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.9](https://github.com/codsen/codsen/compare/util-nonempty@3.0.8...util-nonempty@3.0.9) (2021-03-23)

**Note:** Version bump only for package util-nonempty





## 3.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 3.0.0 (2021-01-23)

### Features

- rewrite in TS, use named exports ([5cbaf96](https://github.com/codsen/codsen/commit/5cbaf962393d451ef5c15f3cf69e8ecd72691df6))

### BREAKING CHANGES

- previously, you'd consume like `import nonEmpty from ...` - now consume like `import { nonEmpty } from ...`

## 2.10.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

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
