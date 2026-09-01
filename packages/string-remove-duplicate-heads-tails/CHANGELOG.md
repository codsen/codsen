# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 7.2.3 (2026-09-01)

### Bug Fixes

- align range input and output types ([1a13db6](https://github.com/codsen/codsen/commit/1a13db665fe2f9e77c6b5fd509980c87e5a57baf))

## 7.2.2 (2026-08-22)

### Performance Improvements

- optimise package hot paths and JSON editing ([f3112bd](https://github.com/codsen/codsen/commit/f3112bd7fc0d7c9bc09312d3744c950691d72ca5))

## 7.2.0 (2026-08-19)

### Bug Fixes

- resolve various review findings ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))
- standardise duplicate marker errs ([df3beb1](https://github.com/codsen/codsen/commit/df3beb11f8fa141c16aa0c1159c1228627eb369a))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

### Reverts

- Revert "Merge pull request #128 from codsen/release/npm-32198404552-1" ([5baeeaa](https://github.com/codsen/codsen/commit/5baeeaaa677b86f1eaa6396cadf3aea32b06416e)), closes [#128](https://github.com/codsen/codsen/issues/128)
- Revert "Merge pull request #127 from codsen/release/npm-32194020886-1" ([5f1e94d](https://github.com/codsen/codsen/commit/5f1e94deef910ce735266b16aeee08a76de7a862)), closes [#127](https://github.com/codsen/codsen/issues/127)

## 7.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 6.1.0 (2022-08-12)

### Features

- export types ([ff7e78a](https://github.com/codsen/codsen/commit/ff7e78a072dc65fc45bd5a598cfdee6017d3dc5e))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 6.0.16 (2022-04-18)

### Fixed

- tweak types ([6cbe6ab](https://github.com/codsen/codsen/commit/6cbe6abca80722704227c8271144ad9562e4260d))

## 6.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 5.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 5.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 5.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 5.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([bcdd142](https://github.com/codsen/codsen/commit/bcdd1424d3f4495bd18c95388a8ad925de6893b8))

### BREAKING CHANGES

- previously: `import remDup from ...` - now `import { remDup } from ...`

## 3.0.37 (2019-10-02)

### Performance Improvements

- remove options checking (check-types-mini) to make operations 4 times faster ([1beffd4](https://gitlab.com/codsen/codsen/commit/1beffd4))

## 2.11.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 2.9.0 (2018-12-26)

- Relax the API and switch to _Prettier_ ([8aa4018](https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-duplicate-heads-tails/commits/8aa4018))

## 2.8.0 (2018-10-26)

- Updated all dependencies
- Restored coveralls.io reporting
- Restored unit test linting

## 2.7.0 (2018-06-26)

- Updated dependencies, particularly, [string-trim-spaces-only](https://www.npmjs.com/package/string-trim-spaces-only) and others

## 2.6.0 (2018-06-20)

- Two `range-` dependencies have been renamed, namely [ranges-push](https://www.npmjs.com/package/ranges-push) and [ranges-apply](https://www.npmjs.com/package/ranges-apply). We tapped them.

## 2.5.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis
- Removed `package-lock`

## 2.4.0 (2018-05-16)

- Tapped dependency [string-match-left-right](https://github.com/codsen/string-match-left-right) with its new `{relaxedApi: true}` option. This prevents `throw` errors in some edge case scenarios.

## 2.3.0 (2018-05-15)

- Set up [Prettier](https://prettier.io)
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## 2.2.0 (2018-03-27)

- Relaxed the API - if the input is non-string, it's just returned back.
- Switched from raw ESLint on `airbnb-base` preset to raw ESLint and Prettier.

## 2.1.0 (2018-02-14)

- Trimming now touches only spaces. Line breaks, tabs and non-breaking spaces are not touched.

## 2.0.0 (2018-02-13)

- Rewrote the whole thing. Added more unit tests.

## 1.0.0 (2018-01-11)

- First public release
