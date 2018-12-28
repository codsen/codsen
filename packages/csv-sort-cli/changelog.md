# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.7.2](https://bitbucket.org/codsen/codsen/src/master/packages/csv-sort-cli/compare/csv-sort-cli@1.7.1...csv-sort-cli@1.7.2) (2018-12-27)

**Note:** Version bump only for package csv-sort-cli





## [1.7.1](https://bitbucket.org/codsen/codsen/src/master/packages/csv-sort-cli/compare/csv-sort-cli@1.7.0...csv-sort-cli@1.7.1) (2018-12-27)

**Note:** Version bump only for package csv-sort-cli





# 1.7.0 (2018-12-26)


### Features

* add unit tests for CLI operations ([3676894](https://bitbucket.org/codsen/codsen/src/master/packages/csv-sort-cli/commits/3676894))





## 1.6.0 (2018-06-25)

- ✨ Added unit tests
- 🌵 Removed ava ESLint plugin until it's fixed for ESLint `v.5`

## 1.5.0 (2018-06-21)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 1.4.0 (2018-05-03)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.
- ✨ Stopped transpiling to ES5, dropped Babel and bumped the Node engines to `>=8`

## 1.3.0 (2017-12-08)

### Updated

- ✨ Serving transpiled code now. Node version requirements are way lower, not `6.8.0` as before. I test on Travis against Node `v.4` now.

## 1.2.0 (2017-11-12)

### Updated

- The to the latest API, v.2

## 1.1.0 (2017-10-09)

### Added

- Switched from JS Standard to raw ESLint on `airbnb-base` preset with semicolons off. Linting is way stricter now.
- Added second entry point when calling via CLI: `sortcsv`. Now you can call this library either via `sortcsv` or `csvsort`. Both names will work. Easier to remember.

## 1.0.0 (2017-08-26)

- First public release
