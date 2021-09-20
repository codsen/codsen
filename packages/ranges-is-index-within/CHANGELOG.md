# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.2](https://github.com/codsen/codsen/compare/ranges-is-index-within@3.0.1...ranges-is-index-within@3.0.2) (2021-09-20)

**Note:** Version bump only for package ranges-is-index-within





## 3.0.1 (2021-09-13)

### Bug Fixes

- bump TS and separate ESLint plugins away from this monorepo ([2e07d42](https://github.com/codsen/codsen/commit/2e07d424222b6ffedf5fb45c83ad453627ec2904))

## 3.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 2.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 2.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 2.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 2.0.0 (2021-01-23)

### Features

- rewrite in TS and start using named exports ([a716ebe](https://github.com/codsen/codsen/commit/a716ebe4d095bf9cb2c92965144dbd25206556b6))

### BREAKING CHANGES

- before: `import isIndexWithin from ...` - now `import { isIndexWithin } from ...`

## 1.16.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.15.0 (2020-09-24)

### Features

- add safeguards against wrong input types ([2949e4d](https://gitlab.com/codsen/codsen/commit/2949e4dbad8cac2c97996401b21fafffc83aff6e))

## 1.14.0 (2019-06-01)

### Features

- Add benchmark ([e8ad5d6](https://gitlab.com/codsen/codsen/commit/e8ad5d6))
- Rebase removing all dependencies, simplifying algorithm and making it around 85x faster ([a6fb39f](https://gitlab.com/codsen/codsen/commit/a6fb39f))

## 1.14.0 (2019-05-11)

Rebased the program to be around 84 times faster - from around 4,443 ops/sec to 396,730 ops/sec. The plain `Array.some`/`Array.find` is still around 1.4 times faster (around 490,747 ops/sec) but we perform input validation and still return a result if null is given (meaning there are no ranges) so it simplifies the code of the parent packages.

- 💥 Removed `opts.skipIncomingRangeSorting` because we're switched to simple `Array.some` now
- 💥 Removed all dependencies:
  - `lodash.isplainobject`
  - `check-types-mini`
  - `is-natural-number-string`
  - `is-natural-number`
  - `ordinal-number-suffix`
  - `ranges-sort`

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
