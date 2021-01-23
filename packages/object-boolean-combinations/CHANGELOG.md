# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* allow any types in override object key values ([7654531](https://github.com/codsen/codsen/commit/765453106abe434f8afc2c002e1fab60bec2409a))
* always return boolean values, don't use numbers 0/1 ([507c7cd](https://github.com/codsen/codsen/commit/507c7cd0e30e2109b90ebd70eb0454a02508bb5f))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* optional third input arg to force bool values in the output ([56afb39](https://github.com/codsen/codsen/commit/56afb39d07af060c5bb5e55b7a8cfd6da1ac7689))
* recode in TS and start using named exports ([75d5dc0](https://github.com/codsen/codsen/commit/75d5dc0419303284006b88e6fcbe4a2d9b2e6faf))


### BREAKING CHANGES

* previously default was exported: "import combinations from ..." - now use named
export "import { combinations } from ..."
* now all combinations' values are booleans, no more digits 0 or 1





## 3.0.0 (2020-12-06)

### BREAKING CHANGES

- now all combinations' values are booleans, no more digits `0` or `1` ([dbb2f05](https://git.sr.ht/~royston/codsen/commit/dbb2f05129e0e8b7b95593c6cc19b8ebd859ecad)). Type safety, you know.

## 2.12.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.11.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 2.5.0 (2018-12-26)

- ✨ Allow any types in override object key values ([af4f99d](https://gitlab.com/codsen/codsen/tree/master/packages/object-boolean-combinations/commits/af4f99d))

## 2.4.0 (2018-10-24)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 2.3.0 (2018-07-25)

- ✨ Allow override object key values to be of any type
- ✨ Small improvements to the setup

## 2.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 2.1.0 (2018-05-17)

### Changed

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rules, dropped `airbnb-base`
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Now unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## 2.0.0 (2017-12-12)

### Changed

- ✨ Rebased the source in ES Modules
- ✨ Set up Rollup and now we are generating three builds: CommonJS, UMD and ES Modules (native code).
- ✨ Small tweaks to the code, no changes to the API.

**PS. Bumping the major version just in case it breaks something. But it should not.**
