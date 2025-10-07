# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 4.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 3.2.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 3.1.0 (2022-04-10)

### Features

- export version ([6a0c87c](https://github.com/codsen/codsen/commit/6a0c87c68cb7f4a6a6b18940e838446303108ba5))

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

- rewrite in TS, start using named exports ([edf92c8](https://github.com/codsen/codsen/commit/edf92c8a8682a3d44e69f5d6c218956c4d8b5b59))

### BREAKING CHANGES

- previously: `import containsOnlyEmptySpace from ...` - now `import { empty } from ...`

## 1.10.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.9.0 (2020-01-26)

### Fixed

- fix algorithm when input is an empty string ([99b046a](https://gitlab.com/codsen/codsen/commit/99b046a1ce96b2719f83595f7981e74081565531))

### Features

- removed one dependency and sped up the program by 200% ([d1053cc](https://gitlab.com/codsen/codsen/commit/d1053cc48db252c87ca0731813958da42757e07c))

## 1.8.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 1.4.0 (2018-10-13)

- Updated all dependencies and restored coverage tracking both via terminal when testing and through coveralls.io

## 1.3.0 (2018-06-13)

GitHub sold us out. In the meantime, we:

- Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis
- Removed `package-lock`

## 1.2.0 (2018-05-14)

### Improvements

- Now pointing unit tests at ES Modules build, not CommonJS-one. This means unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.
- Tweaks to ava [config](https://github.com/avajs/ava/blob/master/docs/recipes/es-modules.md) in `package.json`, properly enabling the `dev` Rollup builds.

## 1.1.0 (2018-05-01)

### Features

- Set up [Prettier](https://prettier.io)
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## 1.0.0 (2018-03-10)

- First public release
