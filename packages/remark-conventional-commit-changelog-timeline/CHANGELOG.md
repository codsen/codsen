# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 3.3.3 (2026-09-01)

### Bug Fixes

- **object-delete-key:** make deletion linear and safe ([6d2623f](https://github.com/codsen/codsen/commit/6d2623fc25bc0a67f9f291c2e530d5f7584e7d27))
- **remark-typography:** preserve phrasing context ([371dd5e](https://github.com/codsen/codsen/commit/371dd5e98481277017d90182e33125a96f179abd))

## 3.3.0 (2026-08-19)

### Bug Fixes

- resolve various review findings ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))
- tweak deps ([bd41b1f](https://github.com/codsen/codsen/commit/bd41b1fd6a892ab3b939775abd800273cdc3f77a))
- type raw changelog markup explicitly ([b5ead07](https://github.com/codsen/codsen/commit/b5ead07e1dcfbd468afae3d8cb2e3802205c18e4))

### Features

- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

### Reverts

- Revert "Merge pull request #128 from codsen/release/npm-32198404552-1" ([5baeeaa](https://github.com/codsen/codsen/commit/5baeeaaa677b86f1eaa6396cadf3aea32b06416e)), closes [#128](https://github.com/codsen/codsen/issues/128)
- Revert "Merge pull request #127 from codsen/release/npm-32194020886-1" ([5f1e94d](https://github.com/codsen/codsen/commit/5f1e94deef910ce735266b16aeee08a76de7a862)), closes [#127](https://github.com/codsen/codsen/issues/127)

## 3.1.0 (2023-05-21)

### Features

- move the source back to monorepo, update deps ([6f470d9](https://github.com/codsen/codsen/commit/6f470d9d863736fbed9b1fc653421b8ad7c267a1))

## 3.0.7 (2023-03-12)

### Bug Fixes

- move out of parked ([f9a1e1b](https://github.com/codsen/codsen/commit/f9a1e1b27e97cb665f8b841b3a773265c1ccbac6))

## 3.0.0 (2022-12-01)

### Features

- remove pure-ESM setup ([1cf14c4](https://github.com/codsen/codsen/commit/1cf14c4707f1f5141c2d04051e7263c9bff8f57c))

### BREAKING CHANGES

- you can `require` this package now; also minimum Node requirements are v14.18 or
  above

## 2.0.0 (2022-10-26)

### Features

- allow date customisation ([4d90331](https://github.com/codsen/codsen/commit/4d903316809d6632753a8a33f7d9a007a94b89e4))

### BREAKING CHANGES

- implement a callback interface to fully customise the date `div` contents

## 1.2.0 (2022-10-23)

### Features

- wrap emoji with a `span` ([9d9e25f](https://github.com/codsen/codsen/commit/9d9e25f86fb333a60d5f2fff7f0f293bb5620c63))

## 1.1.0 (2022-10-23)

### Features

- add more emoji and stop using word bugs in patch bumps ([90a1d0e](https://github.com/codsen/codsen/commit/90a1d0ef1132f0976502ea55d42a9a06ca986d24))

## 1.0.1 (2022-10-22)

### Fixed

- init ([61d8011](https://github.com/codsen/codsen/commit/61d8011adcbd4c49642ba7e7a3e3c50feb460ef9))
