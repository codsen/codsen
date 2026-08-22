# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 4.2.2 (2026-08-22)

### Performance Improvements

- optimise package hot paths and JSON editing ([f3112bd](https://github.com/codsen/codsen/commit/f3112bd7fc0d7c9bc09312d3744c950691d72ca5))

## 4.2.0 (2026-08-19)

### Bug Fixes

- make validation diagnostics safe ([7b01074](https://github.com/codsen/codsen/commit/7b0107476f12734aeb8e82852ba980b187280110))
- resolve various review findings ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))
- validate the options argument ([3bb4936](https://github.com/codsen/codsen/commit/3bb4936398b7caaef4e3e1520fedf805dbe60933))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

### Reverts

- Revert "Merge pull request #128 from codsen/release/npm-32198404552-1" ([5baeeaa](https://github.com/codsen/codsen/commit/5baeeaaa677b86f1eaa6396cadf3aea32b06416e)), closes [#128](https://github.com/codsen/codsen/issues/128)
- Revert "Merge pull request #127 from codsen/release/npm-32194020886-1" ([5f1e94d](https://github.com/codsen/codsen/commit/5f1e94deef910ce735266b16aeee08a76de7a862)), closes [#127](https://github.com/codsen/codsen/issues/127)

## 4.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 3.2.0 (2022-08-12)

### Features

- export types ([4f5994e](https://github.com/codsen/codsen/commit/4f5994e7b6f1dcbff8c1b5d0516f87ad7b125885))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 3.1.3 (2022-04-18)

### Fixed

- tweak types ([f01fc91](https://github.com/codsen/codsen/commit/f01fc91f31bf9a7c62325f5ea0ce705896cefb05))

## 3.1.0 (2022-04-10)

### Features

- export defaults ([626ed28](https://github.com/codsen/codsen/commit/626ed287bc4add9a6ddc5a7a9a2759f5d1cbc53c))

## 3.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 2.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 2.0.16 (2021-04-14)

### Fixed

- correctly treat non-JSON data structures with undefined as a value ([bf1454a](https://github.com/codsen/codsen/commit/bf1454a5cdb1b8be72b2ad78005183fed1842f5e)), closes [#8](https://github.com/codsen/codsen/issues/8)

## 2.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 2.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 2.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([d72dde6](https://github.com/codsen/codsen/commit/d72dde6ef10e7bf10a7c050df39be2e4f8187796))

### BREAKING CHANGES

- previously you'd consume like: `import deleteKey from ...` - now: `import { deleteKey } from ...`

## 1.10.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.9.0 (2019-10-02)

### Features

- make program run faster by removing options validation ([9d8cef6](https://gitlab.com/codsen/codsen/commit/9d8cef6))

## 1.8.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 1.5.0 (2018-10-24)

- Updated all dependencies
- Restored coveralls.io reporting
- Restored unit test linting

## 1.4.0 (2018-06-19)

GitHub sold us out. In the meantime, we:

- Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis

## 1.3.0 (2018-05-25)

- Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 1.2.0 (2018-03-11)

- Updated all dependencies
- Switched from deprecated `posthtml-ast-is-empty` to `ast-is-empty` ([npm](https://www.npmjs.com/package/ast-is-empty), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/ast-is-empty))

## 1.1.0 (2017-10-30)

- Now accepts globs everywhere, see [matcher](https://github.com/sindresorhus/matcher)'s API which is driving the globbing. This comes from `ast-monkey` ([npm](https://www.npmjs.com/package/ast-monkey), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey)) tapping `matcher`.

## 1.0.0 (2017-10-23)

- First public release
