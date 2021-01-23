# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.0.0 (2021-01-23)


### Bug Fixes

* fix algorithm when input is an empty string ([8af3e09](https://github.com/codsen/codsen/commit/8af3e0974d4b0cbaef435fc08f3119220d978686))
* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* removed one dependency and sped up the program by 200% ([69e9f1c](https://github.com/codsen/codsen/commit/69e9f1c4e0d862dc8f5531baf8f3f7741c88b843))
* rewrite in TS, start using named exports ([edf92c8](https://github.com/codsen/codsen/commit/edf92c8a8682a3d44e69f5d6c218956c4d8b5b59))


### BREAKING CHANGES

* previously: "import containsOnlyEmptySpace from ..." - now "import { empty } from
..."





## 1.10.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.9.0 (2020-01-26)

### Bug Fixes

- fix algorithm when input is an empty string ([99b046a](https://gitlab.com/codsen/codsen/commit/99b046a1ce96b2719f83595f7981e74081565531))

### Features

- removed one dependency and sped up the program by 200% ([d1053cc](https://gitlab.com/codsen/codsen/commit/d1053cc48db252c87ca0731813958da42757e07c))

## 1.8.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.4.0 (2018-10-13)

- ✨ Updated all dependencies and restored coverage tracking both via terminal when testing and through coveralls.io

## 1.3.0 (2018-06-13)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 1.2.0 (2018-05-14)

### Improved

- ✨ Now pointing unit tests at ES Modules build, not CommonJS-one. This means unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.
- ✨ Tweaks to ava [config](https://github.com/avajs/ava/blob/master/docs/recipes/es-modules.md) in `package.json`, properly enabling the `dev` Rollup builds.

## 1.1.0 (2018-05-01)

### Added

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## 1.0.0 (2018-03-10)

- First public release
