# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 4.2.0 (2026-08-18)

### Bug Fixes

- make validation diagnostics safe ([7b01074](https://github.com/codsen/codsen/commit/7b0107476f12734aeb8e82852ba980b187280110))
- resolve review findings REV-004 through REV-007 ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

### Performance Improvements

- stop shipping debug-only work in published bundles ([6fe5fee](https://github.com/codsen/codsen/commit/6fe5feebdf726b553ae3034690634166b461fca5))

## 4.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 3.2.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 3.1.3 (2022-04-18)

### Fixed

- tweak types ([a254fd8](https://github.com/codsen/codsen/commit/a254fd88b3ff2598635d51d93795e215d7522cca))

## 3.1.0 (2022-04-10)

### Features

- export defaults ([1374d22](https://github.com/codsen/codsen/commit/1374d228706a112720b6e0080e308f500b6ae48d))

## 3.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 2.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 2.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 2.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 2.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([63faf16](https://github.com/codsen/codsen/commit/63faf16c0c926be440449ca849318c178e4aba9d))

### BREAKING CHANGES

- previously you'd consume like: `import alts from ...` - now: `import { alts } from ...`

## 1.5.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.4.0 (2019-06-01)

### Features

- Migrate to monorepo and some rebasing ([2015845](https://gitlab.com/codsen/codsen/commit/2015845))

## 1.4.0 (2019-04-14)

- Migrating this package to our main monorepo on GitLab
