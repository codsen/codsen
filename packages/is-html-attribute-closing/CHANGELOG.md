# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 4.2.2 (2026-08-22)

### Performance Improvements

- optimise package hot paths and JSON editing ([f3112bd](https://github.com/codsen/codsen/commit/f3112bd7fc0d7c9bc09312d3744c950691d72ca5))

## 4.2.0 (2026-08-19)

### Bug Fixes

- declare the development logging guard ([f09ba2b](https://github.com/codsen/codsen/commit/f09ba2b9fdd6602ed648ef568639b060eb56b5a6))
- resolve various review findings ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

### Reverts

- Revert "Merge pull request #128 from codsen/release/npm-32198404552-1" ([5baeeaa](https://github.com/codsen/codsen/commit/5baeeaaa677b86f1eaa6396cadf3aea32b06416e)), closes [#128](https://github.com/codsen/codsen/issues/128)
- Revert "Merge pull request #127 from codsen/release/npm-32194020886-1" ([5f1e94d](https://github.com/codsen/codsen/commit/5f1e94deef910ce735266b16aeee08a76de7a862)), closes [#127](https://github.com/codsen/codsen/issues/127)

## 4.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 3.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 3.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 2.3.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 2.2.6 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 2.2.0 (2021-03-23)

### Features

- improved recognition of HTML inline style attribute patterns ([5c104d3](https://github.com/codsen/codsen/commit/5c104d3710f34694898099e2d29a2da5f1fc9586))

## 2.1.0 (2021-02-07)

### Features

- improved ERB templating tag recognition ([ecb3272](https://github.com/codsen/codsen/commit/ecb3272ed3e18da1ad729f8166c1dbdd9567f1b6))

## 2.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 2.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([6a8cf5a](https://github.com/codsen/codsen/commit/6a8cf5aa6a6eb1c678513c39a6d0efe16e07d6bf))

### BREAKING CHANGES

- previously, you'd consume like: `import isAttrClosing from ...` - now `import { isAttrClosing } from ...`

## 1.5.0 (2020-12-11)

### Fixed

- correctly interpret equal chars inside urls ([71f8dcf](https://git.sr.ht/~royston/codsen/commit/71f8dcf33eb1df1e6781979720ae5e0420a062f8))

### Features

- improve the safeguards against legit equal characters ([d1b34fa](https://git.sr.ht/~royston/codsen/commit/d1b34fa89bd07e03bdb407477a02fa1bc6f119b9))

## 1.4.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.3.0 (2020-10-12)

### Features

- algorithm improvements ([e2b2471](https://gitlab.com/codsen/codsen/commit/e2b2471cd069ca242f3c906542750016ce5f2385))
- recognise nested rogue quote pairs inside attr values ([7366a63](https://gitlab.com/codsen/codsen/commit/7366a6300f8ce2a4b6d5df63c9a910f505c64116))

## 1.2.0 (2020-05-17)

### Features

- insurance against the Killer Triplet ([21c64a2](https://gitlab.com/codsen/codsen/commit/21c64a2fbba5c2e5edc2cdb1fcfbd2c81c6ee67a))

## 1.1.0 (2020-04-13)

### Features

- initial scaffolding ([5968866](https://gitlab.com/codsen/codsen/commit/5968866db6702dba9031b7633e3be92eb0d62d5c))
- improve the mismatching quote recognition ([967bd66](https://gitlab.com/codsen/codsen/commit/967bd66ee2a9b4ff9414d1cca715569f5c677ff6))
- improvements to mismatching HTML attribute quote pair recognition ([050dbe0](https://gitlab.com/codsen/codsen/commit/050dbe02569d98c2741aca00fed990004c22eeb2))
- recognise missing tag closing brackets ([2639868](https://gitlab.com/codsen/codsen/commit/26398686dfffafd069fd25577f69009d5a27f2f9))
- recognise repeated (even spaced) equal signs in front of attributes ([a1fa244](https://gitlab.com/codsen/codsen/commit/a1fa2444167c5471e04860af9d3ec15f946a2489))
- starting index is not on a quote; attribute is missing opening quote ([795d3a8](https://gitlab.com/codsen/codsen/commit/795d3a85e3a3a0b46b2ce3f62e93ee3db8f0610e))
