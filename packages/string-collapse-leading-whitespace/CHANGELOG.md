# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 3.0.0 (2020-09-24)

### Features

- properly treat all kinds of line endings ([aa197c2](https://gitlab.com/codsen/codsen/commit/aa197c22315f748ee3a4719d9a815af0963f72fd))

### BREAKING CHANGES

- it's a fix to support Windows line endings, CRLF, but no changes API-wise

## 2.0.0 (2019-09-14)

### Features

- keep raw non-breaking spaces, gather line breaks and non-breaking spaces ([fae52f8](https://gitlab.com/codsen/codsen/commit/fae52f8))

### BREAKING CHANGES

- Nonbreaking spaces are not removed any more

## 1.12.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.6.0 (2018-12-26)

- ✨ Add the second argument - originalLimitLinebreaksCount - max ceiling count of consecutive line breaks ([74e2458](https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-leading-whitespace/commits/74e2458))

## 1.5.0 (2018-10-25)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 1.4.0 (2018-07-03)

- ✨ Second argument - `originalLimitLinebreaksCount` - let's you override previous default of `1` max line break. Whatever natural number is set here, that many, maximum, linebreaks will be put instead of a whitespace (if that whitespace contains that many at the first place). Practically, we need this to allow empty lines in ranges- class libraries' output. Previously all leading/trailing whitespace was capped to single linebreak and to produce a single empty line we need to consecutive line breaks. This release allows that.

## 1.3.0 (2018-06-29)

- ✨ Set up Rollup to remove comments from the code

## 1.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 1.1.0 (2018-05-26)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 1.0.0 (2018-01-18)

- ✨ First public release
