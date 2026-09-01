# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 6.3.2 (2026-09-01)

### Bug Fixes

- bound eager combination output ([2ab2194](https://github.com/codsen/codsen/commit/2ab21949730c231c918b76ca875051c7abcb6397))
- model fixed combination values ([9bbc12b](https://github.com/codsen/codsen/commit/9bbc12bda952db28e1081a8cb2df9c7eac2c3662))
- preserve proto data keys ([6747b19](https://github.com/codsen/codsen/commit/6747b198c8af2444b75856734422e495d28c11e1))
- validate override objects consistently ([e96da01](https://github.com/codsen/codsen/commit/e96da01079f4aab564d9c9fdfeab9845496767e4))

### Performance Improvements

- clone only participating overrides ([c80f8c3](https://github.com/codsen/codsen/commit/c80f8c37c95a38740905a90a734910e9d484938e))

## 6.3.1 (2026-08-22)

### Performance Improvements

- optimise package hot paths and JSON editing ([f3112bd](https://github.com/codsen/codsen/commit/f3112bd7fc0d7c9bc09312d3744c950691d72ca5))

## 6.3.0 (2026-08-19)

### Bug Fixes

- resolve various review findings ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))
- tweak types ([d1360f6](https://github.com/codsen/codsen/commit/d1360f60b86ca156e2e97bebc52c3577422678f3))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

### Performance Improvements

- build boolean combinations without an intermediate matrix ([87defb1](https://github.com/codsen/codsen/commit/87defb187b407b0ed0bd509eb0e13d3c6cf35714))

### Reverts

- Revert "Merge pull request #128 from codsen/release/npm-32198404552-1" ([5baeeaa](https://github.com/codsen/codsen/commit/5baeeaaa677b86f1eaa6396cadf3aea32b06416e)), closes [#128](https://github.com/codsen/codsen/issues/128)
- Revert "Merge pull request #127 from codsen/release/npm-32194020886-1" ([5f1e94d](https://github.com/codsen/codsen/commit/5f1e94deef910ce735266b16aeee08a76de7a862)), closes [#127](https://github.com/codsen/codsen/issues/127)

## 6.1.0 (2023-05-13)

### Features

- correct the type definitions ([7dd8452](https://github.com/codsen/codsen/commit/7dd8452887634e4ff3175ba489c63a011cc60d37))

## 6.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 5.1.0 (2022-08-12)

### Features

- export types ([5e66a58](https://github.com/codsen/codsen/commit/5e66a585f41f76ecdc0734fb56674e9b15033ee8))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

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

- recode in TS and start using named exports ([75d5dc0](https://github.com/codsen/codsen/commit/75d5dc0419303284006b88e6fcbe4a2d9b2e6faf))

### BREAKING CHANGES

- previously default was exported: `import combinations from ...` - now use named export `import { combinations } from ...`

## 3.0.0 (2020-12-06)

### BREAKING CHANGES

- now all combinations' values are booleans, no more digits `0` or `1` ([dbb2f05](https://git.sr.ht/~royston/codsen/commit/dbb2f05129e0e8b7b95593c6cc19b8ebd859ecad)). Type safety, you know.

## 2.12.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 2.11.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 2.5.0 (2018-12-26)

- Allow any types in override object key values ([af4f99d](https://gitlab.com/codsen/codsen/tree/master/packages/object-boolean-combinations/commits/af4f99d))

## 2.4.0 (2018-10-24)

- Updated all dependencies
- Restored coveralls.io reporting
- Restored unit test linting

## 2.3.0 (2018-07-25)

- Allow override object key values to be of any type
- Small improvements to the setup

## 2.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis

## 2.1.0 (2018-05-17)

### Changes

- Set up [Prettier](https://prettier.io) on a custom ESLint rules, dropped `airbnb-base`
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- Now unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## 2.0.0 (2017-12-12)

### Changes

- Rebased the source in ES Modules
- Set up Rollup and now we are generating three builds: CommonJS, UMD and ES Modules (native code).
- Small tweaks to the code, no changes to the API.

**PS. Bumping the major version just in case it breaks something. But it should not.**
