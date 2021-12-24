# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 4.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 3.14.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 3.13.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 3.13.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 3.13.0 (2021-01-23)

### Features

- rewrite in TS ([41946c2](https://github.com/codsen/codsen/commit/41946c29a993366e0a4b1704f88d1ad1a0031dca))

## 3.12.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 3.11.0 (2019-06-29)

### Features

- Add perf measurement, recording and historical comparison ([1e70e2a](https://gitlab.com/codsen/codsen/commit/1e70e2a))

## 3.10.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 3.4.0 (2018-10-12)

- ✨ Updated all dependencies and restored coverage tracking both via terminal when testing and through coveralls.io

## 3.3.0 (2018-06-15)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 3.2.0 (2018-05-14)

### Improved

- ✨ Now pointing unit tests at ES Modules build, not CommonJS-one. This means, unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.
- ✨ Tweaks to ava [config](https://github.com/avajs/ava/blob/master/docs/recipes/es-modules.md) in `package.json`, properly enabling the `dev` Rollup builds.

## 3.1.0 (2018-04-29)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## 3.0.0 (2017-11-22)

### Changed

- ✨ Rewrote in ES modules, now serving UMD, Common JS and native ES modules builds. Bumping major just in case.
- ✨ Removed JS Standard and switched to raw ESLint on `airbnb-base` preset, with no-semicolon override.

## 1.0.0 (2017-05-22)

- ✨ First public release
