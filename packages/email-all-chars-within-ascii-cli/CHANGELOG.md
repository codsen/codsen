# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.10.63](https://gitlab.com/codsen/codsen/compare/email-all-chars-within-ascii-cli@1.10.62...email-all-chars-within-ascii-cli@1.10.63) (2020-04-26)

**Note:** Version bump only for package email-all-chars-within-ascii-cli





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
