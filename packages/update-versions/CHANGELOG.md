# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.3](https://github.com/codsen/codsen/compare/update-versions@6.0.2...update-versions@6.0.3) (2022-12-22)

**Note:** Version bump only for package update-versions

## 6.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 5.2.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 5.1.0 (2022-04-11)

### Features

- export defaults and version ([1107244](https://github.com/codsen/codsen/commit/1107244b45eff96ac1fc4ab992031ede0d10ba8c))

## 5.0.4 (2021-11-04)

### Fixed

- update the API to match the updated p-progress ([8aa235c](https://github.com/codsen/codsen/commit/8aa235c8ced8daefcfdab14e380d9765f980ef8d))

## 5.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 4.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))
- file-based blacklisting of the packages to stop updating ([b6a8516](https://github.com/codsen/codsen/commit/b6a85168a4507819d17c6861f2ae302811c8af02))

## 4.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 4.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 4.0.0 (2021-01-23)

- there are no API changes but we're bumping _major_ just in case as the whole monorepo was migrated to TS

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

- First public release
