# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 0.10.0 (2026-08-18)

### Bug Fixes

- make validation diagnostics safe ([7b01074](https://github.com/codsen/codsen/commit/7b0107476f12734aeb8e82852ba980b187280110))
- pair tsd-extract's braces by nesting depth ([ae1746d](https://github.com/codsen/codsen/commit/ae1746d490c55f28b38c17df0f19aff80d3db26b))
- report invalid source input and streamline chunk joins ([fc7dd7e](https://github.com/codsen/codsen/commit/fc7dd7e1bab85582ef9b2af1b77525c76bb5f652))
- resolve review findings REV-004 through REV-007 ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))
- skip strings and comments when pairing tsd-extract's braces ([54df88c](https://github.com/codsen/codsen/commit/54df88cd0d38040f756569e288f482fa79035c39))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

### Reverts

- Revert "Merge pull request #127 from codsen/release/npm-32194020886-1" ([5f1e94d](https://github.com/codsen/codsen/commit/5f1e94deef910ce735266b16aeee08a76de7a862)), closes [#127](https://github.com/codsen/codsen/issues/127)

## 0.8.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 0.7.0 (2022-10-05)

### Features

- query sub keys from interfaces ([aa42b2d](https://github.com/codsen/codsen/commit/aa42b2dab86559346b241cba4845ffe96f1bda04))

## 0.6.4 (2022-08-29)

### Fixed

- setup refresh ([af648a3](https://github.com/codsen/codsen/commit/af648a30a205b6c93bbe7379c7530d2a4cd0e837))

## 0.6.1 (2022-08-14)

### Fixed

- sort only export contents ([233abc5](https://github.com/codsen/codsen/commit/233abc557119b8d4d078b3befa5a51d0429f5bcd))

## 0.6.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 0.5.0 (2022-04-29)

### Fixed

- instead of using undefined for `opts.mustInclude`, use empty string - simplifies types ([aba9f94](https://github.com/codsen/codsen/commit/aba9f949b95577d96a9efb2263139ab4bb621a3a))

### Features

- add a new function, extract() ([5619589](https://github.com/codsen/codsen/commit/5619589b7f84cddc58694f370df66235b54b7ada))

## 0.4.0 (2022-04-24)

### Features

- recognise generics ([09b2aea](https://github.com/codsen/codsen/commit/09b2aea975c1cc8ec63ff78af6bcd7b7ffc95c9d))

## 0.3.0 (2022-04-17)

### Features

- `opts.stripAs` ([e4e1ca6](https://github.com/codsen/codsen/commit/e4e1ca6792045068f80ac40684eac9b7758aae7f))

## 0.2.0 (2022-04-10)

### Fixed

- tweak the algorithm ([e62c8b7](https://github.com/codsen/codsen/commit/e62c8b7bf8c6f4e412a96360d7e86506368d10cc))

### Features

- export defaults, commit `*.d.ts` ([4fb2e22](https://github.com/codsen/codsen/commit/4fb2e22a5ba53e2cbec367bf6b0e0f1b44ac7517))
- `opts.mustInclude` ([c4d5616](https://github.com/codsen/codsen/commit/c4d56169f82ae430680b06a5a15e4045031e8edd))
- `opts.semi` ([569080b](https://github.com/codsen/codsen/commit/569080b8bcdc18b58a4ba46cddc505559671b130))
- tackle the case of type def re-export ([7635e9e](https://github.com/codsen/codsen/commit/7635e9ecf33a3c1192df66fd05180ae0133665a7))

## 0.1.0 (2022-03-21)

### Features

- init ([1f21321](https://github.com/codsen/codsen/commit/1f21321ce99d5b028cf702fa6139071feaf139ae))
