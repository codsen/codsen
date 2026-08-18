# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 0.8.0 (2026-08-18)

### Bug Fixes

- resolve review findings REV-004 through REV-007 ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))

### Features

- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

## 0.6.0 (2022-12-27)

### Features

- tap `string-dashes` and add fixes for multiplication characters ([caf9f4f](https://github.com/codsen/codsen/commit/caf9f4fa858042faacec2a4dcb3b67bdd3d903f2))

## 0.5.0 (2022-12-01)

### Features

- remove pure-ESM setup ([df06a23](https://github.com/codsen/codsen/commit/df06a2369ec5a45fc3ef66a20c1bd60c44d6ca35))

### BREAKING CHANGES

- this package is not pure-ESM any more, you can `require `it; plus, minimum Node
  requirements are now v14.18 and above

## 0.4.4 (2022-10-22)

### Fixed

- set the tree walker to be a synchronous function ([8cf34ec](https://github.com/codsen/codsen/commit/8cf34ec02437e5b2d646508beea8ebad97f5197e))

## 0.4.0 (2022-10-13)

### Features

- correct apostrophes after code tag pairs ([6495fe3](https://github.com/codsen/codsen/commit/6495fe370022eca5ad984b689294cdee33db1a63))

## 0.3.0 (2022-09-27)

### Fixed

- fix dependencies ([c945828](https://github.com/codsen/codsen/commit/c945828389167e9e304b29dd6b3a5ad4e5551f9e))

### BREAKING CHANGES

- fix dependencies

## 1.0.0 (2022-09-25)

- promote semver to stable v1
- move few TS-exclusive dependencies from `devDependencies` to `dependencies` because types are still importing them and so they are not "dev"

## 0.2.0 (2022-09-22)

### Features

- widow word removal ([d4d68d8](https://github.com/codsen/codsen/commit/d4d68d8a1331cf32a41eb1d9ca3f49bb464c59ef))

## 0.1.0 (2022-09-19)

### Features

- init ([b8dbd5f](https://github.com/codsen/codsen/commit/b8dbd5f74bd831da147f2d8a469996e6cbd14022))
