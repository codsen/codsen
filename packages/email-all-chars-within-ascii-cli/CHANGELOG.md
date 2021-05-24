# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 1.13.0 (2021-05-24)


### Features

* config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))





## 1.12.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 1.12.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 1.12.0 (2021-01-23)

### Features

- remove console.log's ([37357bb](https://github.com/codsen/codsen/commit/37357bb53f9542ffbe129d3bd2a7660044bd6619))
- recode to report all non-ASCII characters as well as all excessive lines ([99cdebd](https://github.com/codsen/codsen/commit/99cdebd22d4364a15f0d99d1c83aa9cc07645b2f))

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
