# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.22](https://github.com/codsen/codsen/compare/string-split-by-whitespace@4.0.21...string-split-by-whitespace@4.0.22) (2025-03-01)

**Note:** Version bump only for package string-split-by-whitespace

## 4.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 3.2.0 (2022-08-12)

### Features

- export types ([b0ba7a1](https://github.com/codsen/codsen/commit/b0ba7a18924daf41366be5c721ec3e3f40b65bb0))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 3.1.3 (2022-04-18)

### Fixed

- tweak types ([b44dc8d](https://github.com/codsen/codsen/commit/b44dc8d12b30bfb15936ca63687d6f834c5e1f2a))

## 3.1.0 (2022-04-10)

### Features

- export defaults ([613b92c](https://github.com/codsen/codsen/commit/613b92c4cdf9e84727c8d2d9c3144138ed457bd7))

## 3.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 2.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 2.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 2.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 2.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([262c89a](https://github.com/codsen/codsen/commit/262c89a4cb40cb914937294cd4bcd1aa92b9a1c8))

### BREAKING CHANGES

- previously you'd consume like: `import splitByW from ...` - now `import { splitByW } from ...`

## 1.7.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.6.46 (2019-10-05)

### Performance Improvements

- remove check-types-mini ([f70e58b](https://gitlab.com/codsen/codsen/commit/f70e58b))

## 1.6.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 1.3.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis

## 1.2.0 (2018-05-26)

- Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 1.1.0 (2018-01-12)

- Add `opts.ignoreRanges`

## 1.0.0 (2018-01-11)

- First public release
