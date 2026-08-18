# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 4.3.0 (2026-08-18)

### Bug Fixes

- make validation diagnostics safe ([7b01074](https://github.com/codsen/codsen/commit/7b0107476f12734aeb8e82852ba980b187280110))
- repair representative perf workloads ([975e958](https://github.com/codsen/codsen/commit/975e958c0794ec256eba84e088b472483fb69e52))
- resolve review findings REV-004 through REV-007 ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))
- standardise comma processor errs ([405835e](https://github.com/codsen/codsen/commit/405835e731ead8ee97319dcc228167d41e757477))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

### Performance Improvements

- stop shipping debug-only work in published bundles ([6fe5fee](https://github.com/codsen/codsen/commit/6fe5feebdf726b553ae3034690634166b461fca5))

## 4.1.0 (2023-05-13)

### Features

- improve the types ([592f58b](https://github.com/codsen/codsen/commit/592f58bb86220a8468acde71510458ceed68fabe))

## 4.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 3.1.0 (2022-08-12)

### Features

- export types ([13606d0](https://github.com/codsen/codsen/commit/13606d09912d0905bd07392c9ab308a9661605bb))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 3.0.13 (2022-04-18)

### Fixed

- tweak the types ([9f5bddb](https://github.com/codsen/codsen/commit/9f5bddbf84173e51214a4c4ea75c527df0297a70))

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

- rewrite in TS, start using named exports ([a127aa9](https://github.com/codsen/codsen/commit/a127aa9ec5946b035a55c6e81b44f4840fbafc09))

### BREAKING CHANGES

- previously you'd consume like: `import processCommaSep from ...` - now `import { processCommaSep } from ...`

## 1.3.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.2.6 (2020-04-26)

### Fixed

- harden the eslint rules set, make all tests pass again and rebase a little ([8c2c0a8](https://gitlab.com/codsen/codsen/commit/8c2c0a8d1b0a0c195c853460ac4de117cee15033))

## 1.2.0 (2020-01-01)

### Fixed

- errCb argument fixable tests and functionality ([f89ebc0](https://gitlab.com/codsen/codsen/commit/f89ebc03858734e67e4ffd4db9a89b4116fa07ea))
- trailing whitespace clause fix ([9ef1181](https://gitlab.com/codsen/codsen/commit/9ef1181c20e15b135b791ccc53343d135241cf22))

### Features

- `opts.innerWhitespaceAllowed` ([65dfb1f](https://gitlab.com/codsen/codsen/commit/65dfb1fa5fed0b201b3e5001d418b49b5f94917c))

## 1.1.0 (2019-12-27)

### Fixed

- add more tests and cover `opts.trailingWhitespaceOK` ([335c6d6](https://gitlab.com/codsen/codsen/commit/335c6d63fa3ff0b324f5d191350fc0e593e88430))
- returned ranges is always array of arrays, not just a single range/array ([f9469a1](https://gitlab.com/codsen/codsen/commit/f9469a1f53aa13c7f85eb953e35428a735232cd1))

### Features

- init ([72acd9a](https://gitlab.com/codsen/codsen/commit/72acd9a022fbf4db0116e3d19b0a5dc451581200))

## 1.0.0 (2019-12-26)

- First public release
