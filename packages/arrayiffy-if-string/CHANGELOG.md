# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 5.2.2 (2026-09-01)

### Bug Fixes

- preserve broad arrayiffy result types ([326ab4b](https://github.com/codsen/codsen/commit/326ab4b55583dcb5cd676f571c10e147f9681c91))

### Performance Improvements

- establish the Node 24 arrayiffy baseline ([f78d36b](https://github.com/codsen/codsen/commit/f78d36b39f4506756ba62c1b0111991726da48e1))
- optimise package hot paths and JSON editing ([f3112bd](https://github.com/codsen/codsen/commit/f3112bd7fc0d7c9bc09312d3744c950691d72ca5))

## 5.2.0 (2026-08-19)

### Bug Fixes

- resolve various review findings ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- export the boxed string type ([c12fb3a](https://github.com/codsen/codsen/commit/c12fb3aced1560cf8df3bf9255acac9619474727))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

### Reverts

- Revert "Merge pull request #128 from codsen/release/npm-32198404552-1" ([5baeeaa](https://github.com/codsen/codsen/commit/5baeeaaa677b86f1eaa6396cadf3aea32b06416e)), closes [#128](https://github.com/codsen/codsen/issues/128)
- Revert "Merge pull request #127 from codsen/release/npm-32194020886-1" ([5f1e94d](https://github.com/codsen/codsen/commit/5f1e94deef910ce735266b16aeee08a76de7a862)), closes [#127](https://github.com/codsen/codsen/issues/127)

## 5.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 4.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 4.0.14 (2022-05-04)

### Fixed

- improve types ([53262e1](https://github.com/codsen/codsen/commit/53262e1e4ba7cd9ea8aad9ce3a07a5aed5d1fdc2))

## 4.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 3.14.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 3.13.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 3.13.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 3.13.0 (2021-01-23)

### Features

- rewrite in TS ([41946c2](https://github.com/codsen/codsen/commit/41946c29a993366e0a4b1704f88d1ad1a0031dca))

## 3.12.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 3.11.0 (2019-06-29)

### Features

- Add perf measurement, recording and historical comparison ([1e70e2a](https://gitlab.com/codsen/codsen/commit/1e70e2a))

## 3.10.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 3.4.0 (2018-10-12)

- Updated all dependencies and restored coverage tracking both via terminal when testing and through coveralls.io

## 3.3.0 (2018-06-15)

GitHub sold us out. In the meantime, we:

- Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis
- Removed `package-lock`

## 3.2.0 (2018-05-14)

### Improvements

- Now pointing unit tests at ES Modules build, not CommonJS-one. This means, unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.
- Tweaks to ava [config](https://github.com/avajs/ava/blob/master/docs/recipes/es-modules.md) in `package.json`, properly enabling the `dev` Rollup builds.

## 3.1.0 (2018-04-29)

- Set up [Prettier](https://prettier.io)
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## 3.0.0 (2017-11-22)

### Changes

- Rewrote in ES modules, now serving UMD, Common JS and native ES modules builds. Bumping major just in case.
- Removed JS Standard and switched to raw ESLint on `airbnb-base` preset, with no-semicolon override.

## 1.0.0 (2017-05-22)

- First public release
