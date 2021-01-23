# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))


### Features

* add reporting what was done ([59e3810](https://github.com/codsen/codsen/commit/59e38104e2450735ed69f9c48119b141706a42f3))
* delete lect internal devDependency records in package.json if it is a normal dependency ([dd57482](https://github.com/codsen/codsen/commit/dd57482d24c218666a99a1e7078004b257598b2d))
* don't touch existing package.json formatting ([d873992](https://github.com/codsen/codsen/commit/d873992fa31e32cc85a3d724531014f02250c7b7))
* Ignores linked dependencies which don't exist on npm yet ([ba8710f](https://github.com/codsen/codsen/commit/ba8710f605d6be639874547f2bb879c2cec4d00a))
* Initial release ([c406b83](https://github.com/codsen/codsen/commit/c406b83bf1ca6a4b702a33f6b585bce89aad0d31))
* internet connection check ([c504c39](https://github.com/codsen/codsen/commit/c504c3994dfaf27edb799460f2b3752c6ba1358f))
* move the bastardised p-progress in as a local dep ([2841c88](https://github.com/codsen/codsen/commit/2841c885e0be6df238d638c14bcd4038f93161e9)), closes [#28](https://github.com/codsen/codsen/issues/28)
* recode fully in async ([10c3300](https://github.com/codsen/codsen/commit/10c3300ea528b2a3732bc455b09d9ed2a5e80a2e))
* recognise and retain pnpm `workspace:` value prefixes ([2d64e47](https://github.com/codsen/codsen/commit/2d64e470560900dfeaf9a3fde0ded6dc21d128a5))
* Remove devdeps if they are among normal deps ([f77e0ae](https://github.com/codsen/codsen/commit/f77e0aee1caab2715dddba4520e075a9d53f6c72))
* start updating lerna as well, newest versions are fine ([4573cb7](https://github.com/codsen/codsen/commit/4573cb7ffea6accf3becfbc0c375be72fe25ef34))
* Support file: dependency sources and tweak readme and skip Lerna ([6890d29](https://github.com/codsen/codsen/commit/6890d29c6f7407151c08871d7dac4d14c1b97575))
* Tweak animated GIF frames ([6b8c4d2](https://github.com/codsen/codsen/commit/6b8c4d285b058664da37cf7a60dd36d381c231fe))


### BREAKING CHANGES

* Full recode





## 3.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.5.0 (2020-10-26)

### Features

- recognise and retain pnpm `workspace:` value prefixes ([47f34aa](https://gitlab.com/codsen/codsen/commit/47f34aae7602e59fad8bf83043c309ec29eb2f4a))

## 2.4.0 (2020-02-09)

### Features

- move the bastardised p-progress in as a local dep ([63a280c](https://gitlab.com/codsen/codsen/commit/63a280ce2a1143c805b206c6ee1b894f98a168b0)), closes [#28](https://gitlab.com/codsen/codsen/issues/28)

## 2.3.0 (2019-11-27)

### Features

- internet connection check ([6493580](https://gitlab.com/codsen/codsen/commit/649358058a931a4a96baef768f4e45c5da093b63))

## 2.2.0 (2019-10-07)

### Features

- add reporting what was done ([cc09c8d](https://gitlab.com/codsen/codsen/commit/cc09c8d))
- start updating lerna as well, newest versions are fine ([3d3e986](https://gitlab.com/codsen/codsen/commit/3d3e986))

## 2.1.0 (2019-10-05)

### Features

- delete lect internal devDependency records in package.json if it is a normal dependency ([83fd996](https://gitlab.com/codsen/codsen/commit/83fd996))

## 2.0.0 (2019-09-23)

### Features

- don't touch existing package.json formatting ([c51782e](https://gitlab.com/codsen/codsen/commit/c51782e))
- recode fully in async ([a3adac5](https://gitlab.com/codsen/codsen/commit/a3adac5))

### BREAKING CHANGES

- Full recode

## 2.0.0 (2019-09-22)

### Improvements

- Fully recoded all operations to be in async and with full progress tracking.
- If package "a" consumes dependency package "b" and the "b" exists on the monorepo, we set "a" package.json version for "b" to be `version` from local "b" package.json. We don't even query npm. For example, we have our own bastardised `ava`, frozen in time at `v2.2.5` which is consumed by all monorepo packages, instead of npm's `v2.4.0` (at the time of writing).
- Removed dependencies `write-json-file` and `format-package` because now we edit JSON as string using `edit-package-json` ([npm](https://www.npmjs.com/package/edit-package-json), [gitlab](https://gitlab.com/codsen/codsen/tree/master/packages/edit-package-json/)). Now we don't touch the formatting of each `package.json` - its indentation or whatever.

## 1.5.0 (2019-06-18)

### Features

- Support file: dependency sources and tweak readme and skip Lerna ([cfbaca4](https://gitlab.com/codsen/codsen/commit/cfbaca4))

## 1.4.0 (2019-04-06)

### Features

- Ignores linked dependencies which don't exist on npm yet ([b4a4a62](https://gitlab.com/codsen/codsen/commit/b4a4a62))
- Tweak animated GIF frames ([81b2e04](https://gitlab.com/codsen/codsen/commit/81b2e04))

## 1.3.0 (2019-02-01)

### Features

- Remove devdeps if they are among normal deps ([9b14456](https://gitlab.com/codsen/codsen/commit/9b14456))

## 1.0.0 - 2019-01-24

- ✨ First public release
