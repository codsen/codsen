# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 5.0.21 (2025-10-01)

**Note:** Version bump only for package util-nonempty

## 5.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 4.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 4.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 3.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 3.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 3.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 3.0.0 (2021-01-23)

### Features

- rewrite in TS, use named exports ([5cbaf96](https://github.com/codsen/codsen/commit/5cbaf962393d451ef5c15f3cf69e8ecd72691df6))

### BREAKING CHANGES

- previously, you'd consume like `import nonEmpty from ...` - now consume like `import { nonEmpty } from ...`

## 2.10.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 2.9.44 (2019-10-02)

### Performance Improvements

- tap `Array.isArray` directly, speed improvements ([83cd308](https://gitlab.com/codsen/codsen/commit/83cd308))

## 2.9.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 2.3.0 (2018-10-26)

- Update all dependencies
- Restore coveralls.io reporting
- Restore unit test linting

## 2.2.0 (2018-07-16)

GitHub sold us out. In the meantime, we:

- Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis

## 2.1.0 (2018-05-25)

- Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 2.0.0 (2017-11-09)

- Numbers are not correctly reported as "non-empty"
- Some rebasing and improvements to the setup

## 1.4.0 (2017-09-23)

- Implemented Rollup to generate 3 flavours of this package: CommonJS, UMD and ESM `module` with `import`/`export`

## 1.3.0 (2017-09-18)

- Add this changelog
- Switched from JS Standard to ESLint on `airbnb-base` preset. It's way better

## 1.0.0 (2016-12-23)

- First public release
