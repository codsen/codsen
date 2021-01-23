# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* rewrite in TS and start using named exports ([56afdfe](https://github.com/codsen/codsen/commit/56afdfe65f159769a5f59a706e13f5c92233ff59))
* shield third input arg from external access, also remove one dependency ([bb8b87e](https://github.com/codsen/codsen/commit/bb8b87e356b155641552fac9522d76f71744637e))


### BREAKING CHANGES

* previously: "import looseCompare from ..." - now "import { looseCompare } from ..."





## 1.9.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.8.0 (2020-02-01)

### Features

- shield third input arg from external access, also remove one dependency ([31c0117](https://gitlab.com/codsen/codsen/commit/31c0117c4c33d3493c5110f7b0c4b99fd24d65a3))

## 1.7.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.3.0 (2018-10-13)

- ✨ Updated all dependencies and restored coverage tracking both via terminal when testing and through coveralls.io

## 1.2.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 1.1.0 (2018-05-02)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## 1.0.0 (2018-03-10)

- ✨ First public release
