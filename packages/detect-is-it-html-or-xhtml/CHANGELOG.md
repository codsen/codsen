# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 6.2.1 (2026-08-22)

### Performance Improvements

- optimise package hot paths and JSON editing ([f3112bd](https://github.com/codsen/codsen/commit/f3112bd7fc0d7c9bc09312d3744c950691d72ca5))

## 6.2.0 (2026-08-19)

### Bug Fixes

- make validation diagnostics safe ([7b01074](https://github.com/codsen/codsen/commit/7b0107476f12734aeb8e82852ba980b187280110))
- reject non-string falsy inputs ([f000de4](https://github.com/codsen/codsen/commit/f000de44f1a5637ca8d5a593b3a9d933f9c7dac0))
- resolve various review findings ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

### Reverts

- Revert "Merge pull request #128 from codsen/release/npm-32198404552-1" ([5baeeaa](https://github.com/codsen/codsen/commit/5baeeaaa677b86f1eaa6396cadf3aea32b06416e)), closes [#128](https://github.com/codsen/codsen/issues/128)
- Revert "Merge pull request #127 from codsen/release/npm-32194020886-1" ([5f1e94d](https://github.com/codsen/codsen/commit/5f1e94deef910ce735266b16aeee08a76de7a862)), closes [#127](https://github.com/codsen/codsen/issues/127)

## 6.0.0 (2022-12-01)

### Bug Fixes

- tweak types ([96755ff](https://github.com/codsen/codsen/commit/96755ff0f516243785080a184f83fd6efc14c6b6))

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 5.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 5.0.14 (2022-04-21)

### Fixed

- improve the throw message ([9c69a06](https://github.com/codsen/codsen/commit/9c69a067dc96490d9ceea69b85399c7d28600bfc))

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

- rewrite in TS, start using named exports ([85483e4](https://github.com/codsen/codsen/commit/85483e4e32eef4566dbd5f11304c1d42f96b9682))

### BREAKING CHANGES

- previously: `import detectIsItHTMLOrXhtml from ...` - now `import { detectIsItHTMLOrXhtml } from ...`

## 3.11.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 3.10.0 (2020-09-27)

### Features

- split tests into separate files and add examples ([d5d1fc3](https://gitlab.com/codsen/codsen/commit/d5d1fc3c29524c53569b2e48c18d63a275afae25))

## 3.9.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 3.3.0 (2018-10-17)

- Updated all dependencies
- Restored unit test coverage tracking: reporting in terminal and coveralls.io
- Restored unit test linting

## 3.2.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis
- Removed `package-lock`

## 3.1.0 (2018-05-03)

- Set up [Prettier](https://prettier.io)
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## 3.0.0 (2017-12-09)

- Rebased in ES node_modules
- Set up the Rollup (nice rhyming). Now we generate CommonJS, UMD and ES Module (native code) builds.
- Set up raw ESLint on `airbnb-base` preset with semicolons off. Also linting for AVA unit tests.

## 2.0.0 (2017-03-02)

- In order to prevent accidental input argument mutation when object is given, now we're throwing a type error when the input argument is present, but of a wrong type. That's enough to warrant a major API change under semver.
