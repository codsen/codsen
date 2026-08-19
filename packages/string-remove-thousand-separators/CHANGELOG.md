# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 7.2.0 (2026-08-19)

### Bug Fixes

- make validation diagnostics safe ([7b01074](https://github.com/codsen/codsen/commit/7b0107476f12734aeb8e82852ba980b187280110))
- resolve review findings REV-004 through REV-007 ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))
- trim production type dependencies ([426e081](https://github.com/codsen/codsen/commit/426e081f78e72bf3caecc138b339722309630dd8))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

### Reverts

- Revert "Merge pull request #128 from codsen/release/npm-32198404552-1" ([5baeeaa](https://github.com/codsen/codsen/commit/5baeeaaa677b86f1eaa6396cadf3aea32b06416e)), closes [#128](https://github.com/codsen/codsen/issues/128)
- Revert "Merge pull request #127 from codsen/release/npm-32194020886-1" ([5f1e94d](https://github.com/codsen/codsen/commit/5f1e94deef910ce735266b16aeee08a76de7a862)), closes [#127](https://github.com/codsen/codsen/issues/127)

## 7.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 6.2.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 6.1.3 (2022-04-18)

### Fixed

- tweak types ([3a2f1a2](https://github.com/codsen/codsen/commit/3a2f1a2b5525c8067abcabd73735511e0ec31ce2))

## 6.1.0 (2022-04-10)

### Features

- export `defaults` ([3b3806f](https://github.com/codsen/codsen/commit/3b3806fcefa94c91d3b653c9cfc0809a46ab76f6))

## 6.0.13 (2022-03-21)

### Fixed

- exit early if number less than one is given ([dc4ffc1](https://github.com/codsen/codsen/commit/dc4ffc12caefc58d370dfde2e34f6b8659f0bb04)), closes [#42](https://github.com/codsen/codsen/issues/42)

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

- rewrite in TS, start using named exports ([caa3f29](https://github.com/codsen/codsen/commit/caa3f29e0b0a2e8cb63f5683a0fc7d1139c72fc7))

### BREAKING CHANGES

- previously: `import remSep from ...` - now `import { remSep } from ...`

## 4.0.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 2.6.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 2.4.0 (2018-10-26)

- Updated all dependencies
- Restored coveralls.io reporting
- Restored unit test linting

## 2.3.0 (2018-06-20)

- Two `range-` dependencies have been renamed, namely [ranges-push](https://www.npmjs.com/package/ranges-push) and [ranges-apply](https://www.npmjs.com/package/ranges-apply). We tapped them.

## 2.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis

## 2.1.0 (2018-05-26)

- Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 2.0.0 (2017-11-08)

- Rewrote in ES Modules and set up Rollup to serve 3 flavours: 1. CommonJS, 2. UMD and 3. ES Modules.

## 1.2.0 (2017-09-22)

- Dropped JS Standard and switched to raw ESLint on `airbnb-base` preset with override to ban semicolons.

## 1.1.0 (2017-08-16)

- New `opts.removeThousandSeparatorsFromNumbers` controls the removal of thousand separators. That's in case somebody would want only to pad the digits (`opts.padSingleDecimalPlaceNumbers`) and/or force the decimal notation (`opts.forceUKStyle`)

## 1.0.0 (2017-08-15)

- First public release
