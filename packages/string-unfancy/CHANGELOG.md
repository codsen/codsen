# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 6.3.0 (2026-09-09)

### Bug Fixes

- **string-unfancy:** normalize every character after expanding ellipses ([8a62ca6](https://github.com/codsen/codsen/commit/8a62ca6a243dbacb7a44b7d37d727e402da4e131))

### Features

- **string-unfancy:** optionally preserve combining marks ([660b7a9](https://github.com/codsen/codsen/commit/660b7a9aedaf201a139700839b4ec8e0078fb10f))

### Performance Improvements

- **string-unfancy:** replace mapped typography in a single pass ([54e3972](https://github.com/codsen/codsen/commit/54e39728b3b3853b67a007635e0a8ba2f51a80a5))

## 6.2.3 (2026-09-06)

### Performance Improvements

- Recorded a 33.77% higher normalized benchmark score than v6.2.2 (327,039 → 437,486).

### Bug Fixes

- **string-unfancy:** streamline recursive decoding with the shared HTML entity codec ([81584b3](https://github.com/codsen/codsen/commit/81584b3ac4a553a5840cdb8ee08eb8b11181a2ec))

## 6.2.2 (2026-09-01)

### Performance Improvements

- Recorded a 101.88% higher normalized benchmark score than v6.1.3 (161,996 → 327,039).

## 6.2.1 (2026-08-22)

### Performance Improvements

- optimise package hot paths and JSON editing ([f3112bd](https://github.com/codsen/codsen/commit/f3112bd7fc0d7c9bc09312d3744c950691d72ca5))

## 6.2.0 (2026-08-19)

### Bug Fixes

- resolve various review findings ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

## 6.1.3 (2026-01-15)

### Performance Improvements

- Recorded a 26.17% higher normalized benchmark score than v6.0.30 (128,397 → 161,996).

## 6.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 5.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 5.0.14 (2022-07-05)

### Performance Improvements

- Recorded a 37.86% higher normalized benchmark score than v5.0.13 (166,494 → 229,526).

## 5.0.13 (2022-04-18)

### Performance Improvements

- Recorded a 25.21% higher normalized benchmark score than v5.0.12 (132,970 → 166,494).

## 5.0.12 (2022-01-22)

### Performance Improvements

- Recorded a 5.81% higher normalized benchmark score than v5.0.11 (125,672 → 132,970).

## 5.0.7 (2021-11-30)

### Performance Improvements

- Recorded a 21.29% higher normalized benchmark score than v5.0.5 (185,249 → 224,685).

## 5.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 4.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 4.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 4.0.1 (2021-01-28)

### Fixed

- add `testStats` to _npmignore_ ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 4.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([f1b6f40](https://github.com/codsen/codsen/commit/f1b6f4033da01a246c50c9f85a4438e5de2ee248))

### BREAKING CHANGES

- previously: `import unfancy from ...` - now `import { unfancy } from ...`

## 3.10.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 3.9.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 3.3.0 (2018-10-26)

- Update all dependencies
- Restore coveralls.io reporting
- Restore unit test linting

## 3.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- Migrate to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- Drop BitHound (RIP) and Travis
- Update the header image with thicker arrows and pretend-to-be-invisible depiction of NBSP which is invisible and nobody has any idea how it should look 👀

## 3.1.0 (2018-05-25)

- Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- Remove `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 3.0.0 (2017-12-13)

- 🔧 Rebased in ES Modules
- 🔧 Now we generate three builds: CommonJS, UMD and ES Modules. All are wired up to `package.json` and WebPack/Rollup should automatically switch to ES Modules-one.

## 2.1.0 (2017-09-19)

- 🔧 The main export is now served transpiled.
- 🔧 Switched to ESLint, stopped using JS Standard.

## 2.0.1 (2017-09-01)

- Added a transpiled version in `/es5/` folder.

## 2.0.0 (2017-07-21)

- 🔧 Improved the algorithm. Actually we don't need to care about emoji and characters that are made up of two Unicode characters (surrogates). This makes it unnecessary to split the string into an array of characters.
- 🔧 API is now more strict, if the input is not `string` or it's missing completely, it will `throw`.

## 1.0.0 (2017-06-26)

- First public release
