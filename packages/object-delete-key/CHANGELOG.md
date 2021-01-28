# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.2](https://github.com/codsen/codsen/compare/object-delete-key@2.0.1...object-delete-key@2.0.2) (2021-01-28)

**Note:** Version bump only for package object-delete-key





## 2.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 2.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([d72dde6](https://github.com/codsen/codsen/commit/d72dde6ef10e7bf10a7c050df39be2e4f8187796))

### BREAKING CHANGES

- previously you'd consume like: `import deleteKey from ...` - now: `import { deleteKey } from ...`

## 1.10.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.9.0 (2019-10-02)

### Features

- make program run faster by removing options validation ([9d8cef6](https://gitlab.com/codsen/codsen/commit/9d8cef6))

## 1.8.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.5.0 (2018-10-24)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 1.4.0 (2018-06-19)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 1.3.0 (2018-05-25)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 1.2.0 (2018-03-11)

- ✨ Updated all dependencies
- ✨ Switched from deprecated `posthtml-ast-is-empty` to `ast-is-empty` ([npm](https://www.npmjs.com/package/ast-is-empty), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/ast-is-empty))

## 1.1.0 (2017-10-30)

- ✨ Now accepts globs everywhere, see [matcher](https://github.com/sindresorhus/matcher)'s API which is driving the globbing. This comes from `ast-monkey` ([npm](https://www.npmjs.com/package/ast-monkey), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey)) tapping `matcher`.

## 1.0.0 (2017-10-23)

- ✨ First public release
