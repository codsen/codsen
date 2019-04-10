# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.13.21](https://gitlab.com/codsen/codsen/compare/ranges-is-index-within@1.13.20...ranges-is-index-within@1.13.21) (2019-04-10)

**Note:** Version bump only for package ranges-is-index-within





## 1.13.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.9.0 (2018-12-26)

- ✨ Now we allow null as ranges array value (2nd arg.) ([4c57155](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-is-index-within/commits/4c57155))
- ✨ Setup refresh and tiny rebasing ([4e5cb2c](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-is-index-within/commits/4e5cb2c))

## 1.8.0 (2018-10-25)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 1.7.0 (2018-07-26)

- ✨ We now allow 2nd argument to be `null`. This will instantly yield `false` result and will not `throw`. It's because we want to avoid type checks, and Slices method `.current()` returns either ranges array or `null`. Latter would have `throw`n up until now.

## 1.6.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 1.5.0 (2018-05-11)

Setup refresh. Plus:

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## 1.4.0 (2018-02-06)

- ✨ `opts.skipIncomingRangeSorting`

## 1.3.0 (2018-01-10)

- ✨ `opts.returnMatchedRangeInsteadOfTrue`

## 1.2.0 (2017-11-29)

- ✨ Set up Rollup and now we generate three builds: CommonJS, UMD and ES Modules.
- ✨ Rebased the source to be in ES Modules.

## 1.1.0 (2017-09-13)

- ✨ If any of the ranges has starting index bigger than ending (like `[2, 1]`), it does not make sense and program will `throw`.
- ✨ Even more unit tests. It does not matter that there's 100% coverage, the more the better, especially testing edge cases.

## 1.0.0 (2017-09-13)

- ✨ Initial release
