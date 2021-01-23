# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 1.12.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))
* remove console.log's ([37357bb](https://github.com/codsen/codsen/commit/37357bb53f9542ffbe129d3bd2a7660044bd6619))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* add unit tests, rebase some functions ([27d9e3f](https://github.com/codsen/codsen/commit/27d9e3f2f7f53e201135e94b5c53e686e38c17c3))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* recode to report all non-ASCII characters as well as all excessive lines ([99cdebd](https://github.com/codsen/codsen/commit/99cdebd22d4364a15f0d99d1c83aa9cc07645b2f))





## 1.11.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.10.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.6.0 (2018-12-26)

- ✨ Add _unit tests_, rebase some functions ([59c5f46](https://gitlab.com/codsen/codsen/tree/master/packages/email-all-chars-within-ascii-cli/commits/59c5f46))

## 1.5.0 (2018-08-17)

- ✨ Updated all dependencies
- ✨ Restored unit test linting

## 1.4.0 (2018-08-17)

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Added unit tests. Finally! The API already had unit tests but CLI wrapper didn't. Now it has.

## 1.3.0 (2018-05-26)

- ✨ Removing transpiling. It's not relevant to modern machines running modern Node.
- ✨ Setup improvements - Prettier, removing `.package-lock` and other small bits

## 1.2.0 (2017-12-09)

- ✨ Set up transpiling. Not everybody will be using Node `6.8.0` and above so ES6 source code might be an issue. Now, transpiled version is served.

## 1.1.0 (2017-12-06)

- ✨ Removed JS Standard and set up raw ESLint on `airbnb-base` config with semicolons turned off
- ✨ Rehaul of many other setup files

## 1.0.0 (2017-08-27)

- First public release
