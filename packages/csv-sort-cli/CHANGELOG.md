# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.9.84](https://gitlab.com/codsen/codsen/compare/csv-sort-cli@1.9.83...csv-sort-cli@1.9.84) (2020-09-28)

**Note:** Version bump only for package csv-sort-cli





## 1.9.51 (2019-11-20)

### Bug Fixes

- update the api to follow meow v4 - fixes aliases ([a878008](https://gitlab.com/codsen/codsen/commit/a878008cbb291466382d8a9256fde189b11bef6c))

## 1.9.37 (2019-08-15)

### Bug Fixes

- fix failing unit test ([c46da2e](https://gitlab.com/codsen/codsen/commit/c46da2e))

## 1.9.29 (2019-07-15)

### Bug Fixes

- Fix one of logical clauses ([961a972](https://gitlab.com/codsen/codsen/commit/961a972))

## 1.9.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.7.0 (2018-12-26)

- ✨ Add unit tests for CLI operations ([3676894](https://gitlab.com/codsen/codsen/tree/master/packages/csv-sort-cli/commits/3676894))

## 1.6.0 (2018-06-25)

- ✨ Added unit tests
- 🔧 Removed ava ESLint plugin until it's fixed for ESLint `v.5`

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

- ✨ Serving transpiled code now. Node version requirements are way lower, not `6.8.0` as before. I test on Travis against Node `v.4` now.

## 1.2.0 (2017-11-12)

- 🔧 Updated to the latest API, v.2

## 1.1.0 (2017-10-09)

- ✨ Switched from JS Standard to raw ESLint on `airbnb-base` preset with semicolons off. Linting is way stricter now.
- ✨ Added second entry point when calling via CLI: `sortcsv`. Now you can call this library either via `sortcsv` or `csvsort`. Both names will work. Easier to remember.

## 1.0.0 (2017-08-26)

- ✨ First public release
