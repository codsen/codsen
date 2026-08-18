# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 4.2.0 (2026-08-18)

### Bug Fixes

- resolve review findings REV-004 through REV-007 ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))
- wait for every requested CSV file ([4b5ec9f](https://github.com/codsen/codsen/commit/4b5ec9f18bf3b3c0c207cb6c5ffce970c62ff878))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- add CSV pipeline and stdout modes ([a056797](https://github.com/codsen/codsen/commit/a056797ca7efe256c20b1e681a84c2c013492f0f))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

## 4.0.0 (2024-01-05)

### Features

- require Node.js 18 ([c8df0d9](https://github.com/codsen/codsen/commit/c8df0d9596c071ed57d6004e1f9733d0b005ed0f))

### BREAKING CHANGES

- Require Node.js 18

## 3.0.3 (2022-12-22)

### Bug Fixes

- fix to show dialog when no args passed ([40bba75](https://github.com/codsen/codsen/commit/40bba753d189bcc41e40baece5352aa9b98f6c38))

## 3.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 2.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 2.0.3 (2021-11-02)

### Features

- migrate to ES Modules ([c579dff](https://github.com/codsen/codsen/commit/c579dff3b23205e383035ca10ddcec671e35d0fe))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 2.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 1.12.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 1.11.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 1.11.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 1.10.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.9.51 (2019-11-20)

### Fixed

- update the api to follow meow v4 - fixes aliases ([a878008](https://gitlab.com/codsen/codsen/commit/a878008cbb291466382d8a9256fde189b11bef6c))

## 1.9.37 (2019-08-15)

### Fixed

- fix failing unit test ([c46da2e](https://gitlab.com/codsen/codsen/commit/c46da2e))

## 1.9.29 (2019-07-15)

### Fixed

- Fix one of logical clauses ([961a972](https://gitlab.com/codsen/codsen/commit/961a972))

## 1.9.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 1.7.0 (2018-12-26)

- Add unit tests for CLI operations ([3676894](https://gitlab.com/codsen/codsen/tree/master/packages/csv-sort-cli/commits/3676894))

## 1.6.0 (2018-06-25)

- Added unit tests
- 🔧 Removed ava ESLint plugin until it's fixed for ESLint `v.5`

## 1.5.0 (2018-06-21)

GitHub sold us out. In the meantime, we:

- Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis

## 1.4.0 (2018-05-03)

- Set up [Prettier](https://prettier.io)
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.
- Stopped transpiling to ES5, dropped Babel and bumped the Node engines to `>=8`

## 1.3.0 (2017-12-08)

- Serving transpiled code now. Node version requirements are way lower, not `6.8.0` as before. I test on Travis against Node `v.4` now.

## 1.2.0 (2017-11-12)

- 🔧 Updated to the latest API, v.2

## 1.1.0 (2017-10-09)

- Switched from JS Standard to raw ESLint on `airbnb-base` preset with semicolons off. Linting is way stricter now.
- Added second entry point when calling via CLI: `sortcsv`. Now you can call this library either via `sortcsv` or `csvsort`. Both names will work. Easier to remember.

## 1.0.0 (2017-08-26)

- First public release
