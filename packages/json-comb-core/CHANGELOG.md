# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 8.0.27 (2025-10-01)

**Note:** Version bump only for package json-comb-core

## 8.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 7.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 7.0.16 (2022-04-25)

### Fixed

- improve types ([b40fdb0](https://github.com/codsen/codsen/commit/b40fdb0a8e94f910487dba2dcbe95ab374c1b34a))

## 7.0.15 (2022-04-18)

### Fixed

- tweak types ([3691de9](https://github.com/codsen/codsen/commit/3691de9821762dbcd8d012d7b0e959e13c5fda21))

## 7.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 6.9.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 6.8.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 6.8.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 6.8.0 (2021-01-23)

### Features

- rewrite in TS ([fb3981e](https://github.com/codsen/codsen/commit/fb3981ef86c24d42db5bf7170b0895c4e3abf3b2))

## 6.7.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 6.6.1 (2019-10-02)

### Fixed

- fix the semver key comparison, regex was off ([6335dc9](https://gitlab.com/codsen/codsen/commit/6335dc9))

## 6.6.0 (2019-09-23)

### Features

- sort keys with semver values by comparing semver, not by alphabettical sort ([a5896fa](https://gitlab.com/codsen/codsen/commit/a5896fa))

## 6.5.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 6.4.0 (2019-01-11)

- Add one more tag before which there will be a line break ([4f00871](https://gitlab.com/codsen/codsen/tree/master/packages/json-comb-core/commits/4f00871))

## 6.3.0 (2019-01-08)

- Add one more tag before which there will be a line break ([4f00871](https://gitlab.com/codsen/codsen/tree/master/packages/json-comb-core/commits/4f00871))

## 6.2.0 (2018-06-11)

GitHub sold us out. God bless their souls and the new billionaire. In the meantime, we:

- Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis
- Remove `package-lock`

## 6.1.0 (2018-05-23)

- Set up [Prettier](https://prettier.io)
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- Now pointing unit tests at ES Modules build, not CommonJS-one. This means, unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.

## 6.0.0 (2018-03-13)

- Added `opts.useNullAsExplicitFalse` on all both sync and async getKeyset methods

Since it's on by default (which is sensible), that's technically a breaking change, which warrants a major semver bump.

## 5.1.0 (2018-01-27)

- `doNotFillThesePathsIfTheyContainPlaceholders` on both `enforceKeysetSync()` and `enforceKeyset`
- `placeholder` on both `enforceKeysetSync()` and `enforceKeyset`

## 5.0.0 (2017-12-28)

✨✨✨ ASYNC! ✨✨✨

- All functions up until now were synchronous. Now all were renamed:

  ```
  getKeyset      => getKeysetSync
  enforceKeyset  => enforceKeysetSync
  sortAllObjects => sortAllObjectsSync
  noNewKeys      => noNewKeysSync
  findUnused     => findUnusedSync
  ```

  In their place, **async-alternatives** were placed. For starters, we have async `getKeyset` and `enforceKeyset` - both consume and return _promises_.

**Please update your API's appending "Sync" on the function names, or better, tap async-ones instead.**

## 4.2.0 (2017-12-12)

- Small rebasing, improvements to the setup and proper deps refresh.

## 4.1.0 (2017-10-11)

- Tapped [`sort-keys`](https://www.npmjs.com/package/sort-keys) on a `deep` setting, replacing the existing deep sort function.

## 4.0.0 (2017-10-09)

- 🔧 method `sortIfObject()` renamed to `sortAllObjects()`. It now performs a _deep sort_ of any objects within anything. If a non-array and non-object is given, same thing is returned bypassing the operations, so it's safe to apply on any JS types. That's thanks to [ast-monkey](https://github.com/codsen/ast-monkey#traverse) which performs the deep traversal.

## 3.0.0 (2017-10-06)

API-wise, there are no changes, but since it's rewrite in ES modules and the arrangement of files is different, I'll bump _semver major_ just in case. Cheers!

- The main source now is in ES2015 modules with `import`/`export`.
- Implemented Rollup to generate 3 flavours of this package: CommonJS, UMD and ESM `module` with `import`/`export`. As a bonus, the Babel setup does not ignore `node_modules` where all dependencies sit, what means no matter were they transpiled or not, this library will not cause problems in `create-react-app` and the likes.

## 2.5.0 (2017-09-06)

- `findUnused()` new options key: `opts.comments`. It let's you ignore and exclude the comment keys from reports.

## 2.4.0 (2017-07-29)

- `object-assign` replaced with ES6 `Object.assign`

## 2.3.0 (2017-06-05)

- Improved some error messages, now outputting both its type and value.

## 2.2.0 (2017-06-02)

- Unit tests covering input arg mutation on all functions that accept objects as input args.
- Essential improvements to `findUnused()` - when input is not normalised, that is some of the JSON's have some fields missing and those fields happen to be placeholders on every single other JSON (or missing), now `findUnused()` will report those fields as unused. Previously it was necessary for a key to be present on all arrays to be admitted into a result list, now it's not.

> Last-one means a lot in practice. For example, mapping files are usually under unidirectional merges - they always overwrite everything lower in the "food chain" of data hierarchy. As a result, often PROD mapping data files are often _incomplete_, because we don't want or need to overwrite everything in DEV data. Which in turn means, that if you tried to run `findUnused()` on both your data JSON files (normalised) AND mapping JSON files (not normalised) before this version, you'd rarely get a result at all. Now it's fixed! 👨‍🔧✨

## 2.1.0 (2017-06-02)

- `findUnused()`
- Removed unused dependency from `package.json`

## 2.0.0 (2017-05-15)

- Added `noNewKeys()`
- 🔧 Tightened up the API, there were major changes within dependencies.

## 1.0.0 (2017-03-18)

- First public release
- Unit test coverage is solid 100%
