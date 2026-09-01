# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 3.3.0 (2026-09-01)

### Bug Fixes

- expose parent declaration directly ([7b5ef85](https://github.com/codsen/codsen/commit/7b5ef851d1682235a6d94c738431be5ed50d1e38))
- handle leading empty AST path keys ([9415aec](https://github.com/codsen/codsen/commit/9415aeca01b40b2197d3eaa45cbb76c6c7e0ebb0))
- keep long AST paths exact ([62da3ec](https://github.com/codsen/codsen/commit/62da3ec4965d01fc12dc1a52a6717a59436462ad))
- preserve empty AST path keys ([ad7b429](https://github.com/codsen/codsen/commit/ad7b4296621c3267aab35590da39436b53bcbbe7))
- preserve zeros in long AST paths ([dafb2e0](https://github.com/codsen/codsen/commit/dafb2e000b00a5e2c75384c27de42a0a8865bb80))

### Features

- support exact AST path segments ([686e2a0](https://github.com/codsen/codsen/commit/686e2a0352be468cab356cace8615cd0b6be3242))

### Performance Improvements

- optimise package hot paths and JSON editing ([f3112bd](https://github.com/codsen/codsen/commit/f3112bd7fc0d7c9bc09312d3744c950691d72ca5))
- refresh AST path baseline ([cf61a7a](https://github.com/codsen/codsen/commit/cf61a7a4be6ceb5b366dd23db13f7589d4566e24))

## 3.2.0 (2026-08-19)

### Bug Fixes

- handle edge cases in next paths ([9e1f85a](https://github.com/codsen/codsen/commit/9e1f85a1241af07213d4e288c074ad2cec245391))
- handle edge cases in previous paths ([53be61e](https://github.com/codsen/codsen/commit/53be61e7dd726fbf859f9166740ec0f2f2f4ce63))
- resolve various review findings ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))
- validate parent path input ([421579c](https://github.com/codsen/codsen/commit/421579c66362e343f2070f2399431660d26de7b9))
- validate upward path input ([79c637b](https://github.com/codsen/codsen/commit/79c637bceab34da506fb3aa0347a641e71465c69))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

### Reverts

- Revert "Merge pull request #128 from codsen/release/npm-32198404552-1" ([5baeeaa](https://github.com/codsen/codsen/commit/5baeeaaa677b86f1eaa6396cadf3aea32b06416e)), closes [#128](https://github.com/codsen/codsen/issues/128)
- Revert "Merge pull request #127 from codsen/release/npm-32194020886-1" ([5f1e94d](https://github.com/codsen/codsen/commit/5f1e94deef910ce735266b16aeee08a76de7a862)), closes [#127](https://github.com/codsen/codsen/issues/127)

## 3.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 2.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 2.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 1.4.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 1.3.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 1.3.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 1.3.0 (2021-01-23)

### Features

- rewrite in TS ([680f046](https://github.com/codsen/codsen/commit/680f0467dcdad3573e7cf21ed7ea8b3c7efb4418))

## 1.2.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.1.2 (2020-04-04)

### Fixed

- don't return null when going up from root, return `"0"` ([7743d87](https://gitlab.com/codsen/codsen/commit/7743d877a357afa1ec0452e83b2c507cd927fcfe))

## 1.1.0 (2020-03-16)

### Features

- initial release ([2a59f29](https://gitlab.com/codsen/codsen/commit/2a59f29c3fb4c02d6fd1a439dc6d879b4de6e972))

## 1.0.0 (2020-03-15)

- First public release.
