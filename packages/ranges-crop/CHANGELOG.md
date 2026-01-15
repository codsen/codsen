# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 6.1.3 (2026-01-15)

**Note:** Version bump only for package ranges-crop

## 6.1.0 (2025-10-15)

### Features

- if value to be added is a number, keep it as is, don't stringify ([ce3e1a5](https://github.com/codsen/codsen/commit/ce3e1a525998ca3c0abf0142affef95b14cd1990))

## 6.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 5.2.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 5.1.0 (2022-04-11)

### Features

- export defaults and version ([1107244](https://github.com/codsen/codsen/commit/1107244b45eff96ac1fc4ab992031ede0d10ba8c))

## 5.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 4.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 4.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 4.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 4.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([1db2eff](https://github.com/codsen/codsen/commit/1db2eff7ce161152d1f8e6f588994b76899673c4))

### BREAKING CHANGES

- previously: `import rCrop from ...` - now `import { rCrop } from ...`

## 3.0.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 2.1.0 (2020-09-07)

### Features

- discard any nulls among arrays ([d984ac0](https://gitlab.com/codsen/codsen/commit/d984ac0b05e9f16ed8d29c12d0b8650e0ddd473c))

## 2.0.35 (2019-10-02)

### Performance Improvements

- remove ordinal number package ([8129ceb](https://gitlab.com/codsen/codsen/commit/8129ceb))

## 1.3.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 1.1.0 (2018-10-25)

- Updated all dependencies
- Restored coveralls.io reporting
- Restored unit test linting

## 1.0.0 (2018-08-16)

- Initial release
