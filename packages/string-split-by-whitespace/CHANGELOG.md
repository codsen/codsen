# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.9](https://github.com/codsen/codsen/compare/string-split-by-whitespace@2.0.8...string-split-by-whitespace@2.0.9) (2021-03-23)

**Note:** Version bump only for package string-split-by-whitespace





## 2.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 2.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([262c89a](https://github.com/codsen/codsen/commit/262c89a4cb40cb914937294cd4bcd1aa92b9a1c8))

### BREAKING CHANGES

- previously you'd consume like: `import splitByW from ...` - now `import { splitByW } from ...`

## 1.7.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.6.46 (2019-10-05)

### Performance Improvements

- remove check-types-mini ([f70e58b](https://gitlab.com/codsen/codsen/commit/f70e58b))

## 1.6.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.3.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 1.2.0 (2018-05-26)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 1.1.0 (2018-01-12)

- ✨ Add `opts.ignoreRanges`

## 1.0.0 (2018-01-11)

- ✨ First public release
