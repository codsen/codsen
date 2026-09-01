# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 5.2.2 (2026-09-01)

### Bug Fixes

- preserve complete ID selectors ([7c79358](https://github.com/codsen/codsen/commit/7c79358a9a3ea0fc71ae9e782fc53716db6573a4))
- preserve complete resource fragments ([3776e95](https://github.com/codsen/codsen/commit/3776e956aac024d980ea66052aee8392c897bfbc))
- preserve converted object graphs ([0bb3c08](https://github.com/codsen/codsen/commit/0bb3c08acc53682dd19999168b407406949f23f1))
- preserve object data properties ([b1da33a](https://github.com/codsen/codsen/commit/b1da33ae72b8923e233186c009cacb5f542e290c))
- publish recursive conversion types ([f01a9da](https://github.com/codsen/codsen/commit/f01a9dae93557fe59e84683f43267ec2583d728c))

### Performance Improvements

- avoid unnecessary context scans ([b23b596](https://github.com/codsen/codsen/commit/b23b596ffb7646639ee462093ac36c8f63065a61))

## 5.2.1 (2026-08-22)

### Performance Improvements

- optimise package hot paths and JSON editing ([f3112bd](https://github.com/codsen/codsen/commit/f3112bd7fc0d7c9bc09312d3744c950691d72ca5))

## 5.2.0 (2026-08-19)

### Bug Fixes

- avoid expanding CSS selectors and references ([8bf8e00](https://github.com/codsen/codsen/commit/8bf8e000002ac495021111a8f89f0eeb0d175821))
- resolve various review findings ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

### Reverts

- Revert "Merge pull request #128 from codsen/release/npm-32198404552-1" ([5baeeaa](https://github.com/codsen/codsen/commit/5baeeaaa677b86f1eaa6396cadf3aea32b06416e)), closes [#128](https://github.com/codsen/codsen/issues/128)
- Revert "Merge pull request #127 from codsen/release/npm-32194020886-1" ([5f1e94d](https://github.com/codsen/codsen/commit/5f1e94deef910ce735266b16aeee08a76de7a862)), closes [#127](https://github.com/codsen/codsen/issues/127)

## 5.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 4.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 4.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 3.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 3.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 3.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 3.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([df180c5](https://github.com/codsen/codsen/commit/df180c5d3f1413ea826e8f771ea57492d3378189))

### BREAKING CHANGES

- previously: `import conv from ...` - now `import { conv } from ...`

## 2.11.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 2.10.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 2.4.0 (2018-10-15)

- Updated all dependencies and restored coverage tracking both via terminal when testing and through coveralls.io

## 2.3.0 (2018-06-27)

- Set up Rollup to remove any comments from build files
- Attempt to fix reported issues with UMD builds `undefined$3` variable not found

## 2.2.0 (2018-06-08)

### Features

- Fixed false positive cases of HTML entities, for example `&#124;`. Thanks James Kupczak!
- Rebased a little
- Migrated to BitBucket...
- ...which means we dropped Travis. But we kept Coveralls.
- RIP BitHound

## 2.1.0 (2018-05-03)

### Features

- Set up [Prettier](https://prettier.io)
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## 2.0.0 (2017-12-06)

### Changes

- Rebased in ES Modules
- Set up Rollup (nice rhyming), now generating transpiled CommonJS, UMD and native ES Module builds.

Bumping major just in case it breaks somebody's API. It shouldn't though.

## 1.5.0 (2017-05-25)

### Fixed

- Dependencies to request the latest `_.clonedeep`
- Readme, added more examples

## 1.4.0 (2017-03-06)

### Features

- More unit tests to cover XHTML code.

## 1.3.0 (2017-03-02)

### Fixed

- Now any input args are not mutated. Ever.

## 1.2.0 (2017-02-17)

### Features

- Table of Contents in README

### Fixed

- Set up blanket deps ranges because it's tedious to update them and these deps never breaking-change
- Updated company name in README and LICENSE

## 1.1.0 (2017-01-09)

### Features

- All hex codes, three and six digits long, are converted to lowercase. This is to prevent case mismatches.
- Test 05.01 to prove this works as intended.

## 1.0.0 (2017-01-06)

Initial release. 100% test coverage.
