# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* discard any nulls among arrays ([2223d17](https://github.com/codsen/codsen/commit/2223d17c53a56c664ff1c074ab83287d4377e771))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* Merge modes via opts.mergeType ([2394464](https://github.com/codsen/codsen/commit/2394464976ce1970bcd31b45d9fd9955f4bbcc09))
* rewrite in TS, start using named exports ([1db2eff](https://github.com/codsen/codsen/commit/1db2eff7ce161152d1f8e6f588994b76899673c4))


### Performance Improvements

* remove ordinal number package ([835c570](https://github.com/codsen/codsen/commit/835c5701728b6ea3b71b81104c67176bb82a180e))


### BREAKING CHANGES

* previously: "import rCrop from ..." - now "import { rCrop } from ..."
* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





## 3.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.1.0 (2020-09-07)

### Features

- discard any nulls among arrays ([d984ac0](https://gitlab.com/codsen/codsen/commit/d984ac0b05e9f16ed8d29c12d0b8650e0ddd473c))

## 2.0.35 (2019-10-02)

### Performance Improvements

- remove ordinal number package ([8129ceb](https://gitlab.com/codsen/codsen/commit/8129ceb))

## 1.3.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.1.0 (2018-10-25)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 1.0.0 (2018-08-16)

- ✨ Initial release
