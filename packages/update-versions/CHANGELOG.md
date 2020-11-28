# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.0.0 (2020-11-28)


### Bug Fixes

* Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))


### Features

* add reporting what was done ([cc09c8d](https://git.sr.ht/~royston/codsen/commits/cc09c8d9734dec7cc33721bd6ef70d07540183cb))
* delete lect internal devDependency records in package.json if it is a normal dependency ([83fd996](https://git.sr.ht/~royston/codsen/commits/83fd9962a85785bce3eae1afa15db1bdf795d4cd))
* don't touch existing package.json formatting ([c51782e](https://git.sr.ht/~royston/codsen/commits/c51782ebbff64b958a0aee018d2c6617e2abb935))
* Ignores linked dependencies which don't exist on npm yet ([b4a4a62](https://git.sr.ht/~royston/codsen/commits/b4a4a62e01868083843268118ed8592e76cb0cdb))
* Initial release ([d9cd787](https://git.sr.ht/~royston/codsen/commits/d9cd7870e61462524964b9d37b7c254e20544533))
* internet connection check ([6493580](https://git.sr.ht/~royston/codsen/commits/649358058a931a4a96baef768f4e45c5da093b63))
* move the bastardised p-progress in as a local dep ([63a280c](https://git.sr.ht/~royston/codsen/commits/63a280ce2a1143c805b206c6ee1b894f98a168b0)), closes [#28](https://git.sr.ht/~royston/codsen/issues/28)
* recode fully in async ([a3adac5](https://git.sr.ht/~royston/codsen/commits/a3adac518883487f26564c8f08af65227889cc39))
* recognise and retain pnpm `workspace:` value prefixes ([47f34aa](https://git.sr.ht/~royston/codsen/commits/47f34aae7602e59fad8bf83043c309ec29eb2f4a))
* Remove devdeps if they are among normal deps ([9b14456](https://git.sr.ht/~royston/codsen/commits/9b144566126fd7b05a2de0201e8506758d592e9a))
* start updating lerna as well, newest versions are fine ([3d3e986](https://git.sr.ht/~royston/codsen/commits/3d3e986ef48125c97726fc9558f3fa2857cb324b))
* Support file: dependency sources and tweak readme and skip Lerna ([cfbaca4](https://git.sr.ht/~royston/codsen/commits/cfbaca46921327e2ef605e8f6c2d8732719e2333))
* Tweak animated GIF frames ([81b2e04](https://git.sr.ht/~royston/codsen/commits/81b2e04a56ab147008c5b0cb667f56f2c30e7d5f))


### BREAKING CHANGES

* Full recode





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
