# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))
* harden the eslint rules set, make all tests pass and rebase a little ([de93cd0](https://github.com/codsen/codsen/commit/de93cd014a022d89a84a4bb649dcce81c76ae1de))


### Features

* add examples ([e2ddc51](https://github.com/codsen/codsen/commit/e2ddc518b2b372c546c5043b003f4074ef67206d))
* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* rewrite in TS and start using named exports ([78e380e](https://github.com/codsen/codsen/commit/78e380eee3bcb8cdf20de44f9ceca5a05347fc65))


### BREAKING CHANGES

* previously: "import deleteObj from ..." - now "import { deleteObj } from ..."





## 1.10.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.9.0 (2020-09-24)

### Features

- add examples ([f628a2f](https://gitlab.com/codsen/codsen/commit/f628a2f5d66dbba77845498d58a5be572b33a624))

## 1.8.63 (2020-04-26)

### Bug Fixes

- harden the eslint rules set, make all tests pass and rebase a little ([c84365e](https://gitlab.com/codsen/codsen/commit/c84365e8aa37ce253d5b6a0a700128db6ee2a3fb))

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

- ✨ Now pointing unit tests at ES Modules build, not CommonJS-one. This means, unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.
- ✨ Tweaks to ava [config](https://github.com/avajs/ava/blob/master/docs/recipes/es-modules.md) in `package.json`, properly enabling the `dev` Rollup builds.

## 1.1.0 (2018-05-01)

### Added

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## 1.0.0 (2018-03-11)

- ✨ First public release
