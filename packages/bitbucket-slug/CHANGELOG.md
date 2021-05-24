# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 2.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 2.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 2.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 2.0.0 (2021-01-23)

### Features

- recode in TS, remove decode function ([1af1c80](https://github.com/codsen/codsen/commit/1af1c80f48f2b00de8de673033408dc6023a072d))

### BREAKING CHANGES

- previously: `import bSlug from ...` - now `import { bSlug } from ...` - plus, removed the string decoding

## 1.11.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.10.0 (2020-09-27)

### Features

- add examples ([336d407](https://gitlab.com/codsen/codsen/commit/336d4075089a9a5cae32601cd0ce3fde8af024da))

## 1.9.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.3.0 (2018-12-26)

- ✨ recognise consecutive dashes ([b44ff9d](https://gitlab.com/codsen/codsen/tree/master/packages/bitbucket-slug/commits/b44ff9d))

## 1.2.0 (2018-10-14)

- ✨ Updated all dependencies and restored unit test coverage tracking: reporting in terminal and coveralls.io

## 1.1.0 (2018-06-13)

- ✨ Feature - recognise consecutive dashes surrounded by hyphens (`## Title -- is the best`)

## 1.0.0 (2018-06-13)

- ✨ First public release
