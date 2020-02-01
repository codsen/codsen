# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
