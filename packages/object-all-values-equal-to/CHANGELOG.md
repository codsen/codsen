# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* remove option checking to make things run faster ([29931cd](https://github.com/codsen/codsen/commit/29931cded409d067b98c5096f1c8c15b243a6996))
* rewrite in TS, start using named exports ([4190a84](https://github.com/codsen/codsen/commit/4190a849df5ed2c76fc08e44199cfb41bee45857))


### BREAKING CHANGES

* previously: "import allEq from ..." - now "import { allEq } from ..."





## 1.9.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.8.0 (2019-10-02)

### Features

- remove option checking to make things run faster ([296989f](https://gitlab.com/codsen/codsen/commit/296989f))

## 1.7.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.3.0 (2018-10-24)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 1.2.0 (2018-06-19)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 1.1.0 (2018-05-21)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Now pointing unit tests at ES Modules build, not CommonJS-one. This means, unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.

## 1.0.0 (2017-12-13)

- ✨ First public release
