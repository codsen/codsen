# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 6.2.4 (2026-09-06)

### Performance Improvements

- Recorded a 6.59% higher normalized benchmark score than v6.2.3 (1220816 → 1301222).

### Bug Fixes

- **ranges-ent-decode:** scan references with the shared HTML entity codec ([e8da950](https://github.com/codsen/codsen/commit/e8da9509fc5e770ad84d64ca850857dc631b9882))

## 6.2.3 (2026-09-01)

### Performance Improvements

- Recorded a 85.19% higher normalized benchmark score than v6.1.3 (659237 → 1220816).

## 6.2.2 (2026-08-22)

### Performance Improvements

- optimise package hot paths and JSON editing ([f3112bd](https://github.com/codsen/codsen/commit/f3112bd7fc0d7c9bc09312d3744c950691d72ca5))

## 6.2.0 (2026-08-19)

### Bug Fixes

- make validation diagnostics safe ([7b01074](https://github.com/codsen/codsen/commit/7b0107476f12734aeb8e82852ba980b187280110))
- resolve various review findings ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))
- standardise entity decoding errs ([c36c61c](https://github.com/codsen/codsen/commit/c36c61cb2c4fe5b69a60adaa6146f341d7780389))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

## 6.1.3 (2026-01-15)

### Performance Improvements

- Recorded a 13.05% higher normalized benchmark score than v6.0.33 (583115 → 659237).

## 6.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 5.2.0 (2022-08-12)

### Features

- export types ([2a85f0c](https://github.com/codsen/codsen/commit/2a85f0cf1310f6dee5b1b39595676e9ba72f7f58))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 5.1.3 (2022-05-04)

### Performance Improvements

- Recorded a 43.87% higher normalized benchmark score than v5.1.2 (600308 → 863665).

## 5.1.2 (2022-04-18)

### Fixed

- tweak types ([1e65f90](https://github.com/codsen/codsen/commit/1e65f901b63c79d1c4ca605e72f0380ef313c43b))

### Performance Improvements

- Recorded a 5.51% higher normalized benchmark score than v5.1.1 (568971 → 600308).

## 5.1.1 (2022-04-17)

### Performance Improvements

- Recorded a 15.83% higher normalized benchmark score than v5.1.0 (491192 → 568971).

## 5.1.0 (2022-04-11)

### Features

- export defaults and version ([1107244](https://github.com/codsen/codsen/commit/1107244b45eff96ac1fc4ab992031ede0d10ba8c))

### Performance Improvements

- Recorded a 15.72% higher normalized benchmark score than v5.0.12 (424465 → 491192).

## 5.0.10 (2021-12-24)

### Performance Improvements

- Recorded a 19.6% higher normalized benchmark score than v5.0.9 (637405 → 762335).

## 5.0.9 (2021-12-24)

### Performance Improvements

- Recorded a 8.46% higher normalized benchmark score than v5.0.8 (587674 → 637405).

## 5.0.7 (2021-11-30)

### Performance Improvements

- Recorded a 53.85% higher normalized benchmark score than v5.0.5 (550186 → 846480).

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

- rewrite in TS and start using named exports ([c05c4d8](https://github.com/codsen/codsen/commit/c05c4d8282829c8bd69a1fe26692c584efa43d55))

### BREAKING CHANGES

- previously: `import rEntDecode from ...` - now `import { rEntDecode } from ...`

## 3.0.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 2.1.0 (2020-09-07)

### Features

- update to the latest ranges-merge which returns null now instead of empty array ([b36d068](https://gitlab.com/codsen/codsen/commit/b36d068bbd940f248d3ea46e5f37082887332785))

## 2.0.36 (2019-10-05)

### Performance Improvements

- remove check-types-mini ([90162d0](https://gitlab.com/codsen/codsen/commit/90162d0))

## 1.4.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 1.1.0 (2018-10-25)

- Updated all dependencies
- Restored coveralls.io reporting
- Restored unit test linting

## 1.0.0 (2018-08-22)

- Initial release
