# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* Merge modes via opts.mergeType ([2394464](https://github.com/codsen/codsen/commit/2394464976ce1970bcd31b45d9fd9955f4bbcc09))
* rewrite in TS, start using named exports ([7ec5d62](https://github.com/codsen/codsen/commit/7ec5d6220a8977db148b51855edb466d2165e650))
* small rebase and improvements ([b4b7f7f](https://github.com/codsen/codsen/commit/b4b7f7fc20cb6f10163590e352564a6cd33be102))


### BREAKING CHANGES

* previsouly you'd consume like: "import rRegex from ..." - now use: "import { rRegex
} from ..."
* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





## 3.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.1.0 (2020-09-07)

### Features

- small rebase and improvements ([13c9c49](https://gitlab.com/codsen/codsen/commit/13c9c49f43a76c137a08e53915dc53ad17da5fa9))

## 1.3.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.1.0 (2018-10-25)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 1.0.0 (2018-08-23)

- ✨ Initial release
