# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.2.5](https://bitbucket.org/codsen/codsen/src/master/packages/json-comb-core/compare/json-comb-core@6.2.4...json-comb-core@6.2.5) (2018-12-29)

**Note:** Version bump only for package json-comb-core





## [6.2.4](https://bitbucket.org/codsen/codsen/src/master/packages/json-comb-core/compare/json-comb-core@6.2.3...json-comb-core@6.2.4) (2018-12-29)

**Note:** Version bump only for package json-comb-core





## [6.2.3](https://bitbucket.org/codsen/codsen/src/master/packages/json-comb-core/compare/json-comb-core@6.2.2...json-comb-core@6.2.3) (2018-12-27)

**Note:** Version bump only for package json-comb-core





## [6.2.2](https://bitbucket.org/codsen/codsen/src/master/packages/json-comb-core/compare/json-comb-core@6.2.1...json-comb-core@6.2.2) (2018-12-27)

**Note:** Version bump only for package json-comb-core





## 6.2.1 (2018-12-26)

**Note:** Version bump only for package json-comb-core





## 6.2.0 (2018-06-11)

GitHub sold us out. God bless their souls and the new billionaire. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Remove `package-lock`

## 6.1.0 (2018-05-23)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Now pointing unit tests at ES Modules build, not CommonJS-one. This means, unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.

# 6.0.0 (2018-03-13)

- ✨ Added `opts.useNullAsExplicitFalse` on all both sync and async getKeyset methods

Since it's on by default (which is sensible), that's technically a breaking change, which warrants a major semver bump.

## 5.1.0 (2018-01-27)

### Added

- ✨ `doNotFillThesePathsIfTheyContainPlaceholders` on both `enforceKeysetSync()` and `enforceKeyset`
- ✨ `placeholder` on both `enforceKeysetSync()` and `enforceKeyset`

# 5.0.0 (2017-12-28)

### Changed

✨✨✨ ASYNC! ✨✨✨

- ✨ All functions up until now were synchronous. Now all were renamed:

```
getKeyset      => getKeysetSync
enforceKeyset  => enforceKeysetSync
sortAllObjects => sortAllObjectsSync
noNewKeys      => noNewKeysSync
findUnused     => findUnusedSync
```

In their place, **async-alternatives** were placed. For starters, we have async `getKeyset` and `enforceKeyset` - both consume and return _promises_.

Please update your API's appending "Sync" on the function names, or better, tap async-ones instead.

## 4.2.0 (2017-12-12)

### Changed

- ✨ Small rebasing, improvements to the setup and proper deps refresh.

## 4.1.0 (2017-10-11)

### Added

- ✨ Tapped [`sort-keys`](https://www.npmjs.com/package/sort-keys) on a `deep` setting, replacing the existing deep sort function.

# 4.0.0 (2017-10-09)

### Changed

- 🔧 method `sortIfObject()` renamed to `sortAllObjects()`. It now performs a _deep sort_ of any objects within anything. If a non-array and non-object is given, same thing is returned bypassing the operations, so it's safe to apply on any JS types. That's thanks to [ast-monkey](https://github.com/codsen/ast-monkey#traverse) which performs the deep traversal.

# 3.0.0 (2017-10-06)

API-wise, there are no changes, but since it's rewrite in ES modules and the arrangement of files is different, I'll bump _semver major_ just in case. Cheers!

### Added

- ✨ The main source now is in ES2015 modules with `import`/`export`.
- ✨ Implemented Rollup to generate 3 flavours of this package: CommonJS, UMD and ESM `module` with `import`/`export`. As a bonus, the Babel setup does not ignore `node_modules` where all dependencies sit, what means no matter were they transpiled or not, this library will not cause problems in `create-react-app` and the likes.

## 2.5.0 (2017-09-06)

### Added

- ✨ `findUnused()` new options key: `opts.comments`. It let's you ignore and exclude the comment keys from reports.

## 2.4.0 (2017-07-29)

### Added

- `object-assign` replaced with ES6 `Object.assign`

## 2.3.0 (2017-06-05)

### Updated

- ☝️ Improved some error messages, now outputting both its type and value.

## 2.2.0 (2017-06-02)

### Added

- 🆕 Unit tests covering input arg mutation on all functions that accept objects as input args.
- ☝️ Essential improvements to `findUnused()` - when input is not normalised, that is some of the JSON's have some fields missing and those fields happen to be placeholders on every single other JSON (or missing), now `findUnused()` will report those fields as unused. Previously it was necessary for a key to be present on all arrays to be admitted into a result list, now it's not.

> Last-one means a lot in practice. For example, mapping files are usually under unidirectional merges - they always overwrite everything lower in the "food chain" of data hierarchy. As a result, often PROD mapping data files are often _incomplete_, because we don't want or need to overwrite everything in DEV data. Which in turn means, that if you tried to run `findUnused()` on both your data JSON files (normalised) AND mapping JSON files (not normalised) before this version, you'd rarely get a result at all. Now it's fixed! 👨‍🔧✨

## 2.1.0 (2017-06-02)

### Added

- 🆕 `findUnused()`

### Removed

- Unused dependency from `package.json`

# 2.0.0 (2017-05-15)

### Added

- 🆕 `noNewKeys()`

### Changed

- ☝️ Tightened up the API, there were major changes within dependencies.

## 1.0.0 (2017-03-18)

### Added

- 🆕 First public release
- Unit test coverage is solid 100%
