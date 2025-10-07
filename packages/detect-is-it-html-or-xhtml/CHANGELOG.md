# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 6.0.20 (2025-10-07)

**Note:** Version bump only for package detect-is-it-html-or-xhtml

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
