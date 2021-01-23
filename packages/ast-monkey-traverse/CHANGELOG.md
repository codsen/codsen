# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))


### Features

* add `innerObj.parentKey` ([de52881](https://github.com/codsen/codsen/commit/de528817dd922a9d47ec85421a0354e9dd4e2bed))
* Add a new key, parentType in a callback innerObj ([57e798e](https://github.com/codsen/codsen/commit/57e798ea8c5894d6c0af438ce9a55bf0232bb1a2))
* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* rewrite in TS, named export is now used ([8983e69](https://github.com/codsen/codsen/commit/8983e6992ef518f8b4cbb734aa22949e68bd5aa1))
* stopping functionality ([1eaf5e6](https://github.com/codsen/codsen/commit/1eaf5e63fac290f7864165836a348fd55a63df58))


### BREAKING CHANGES

* named export is now used - use: "import { traverse }" instead of "import traverse"





## 1.13.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.12.0 (2019-11-27)

### Features

- stopping functionality ([ca17aa1](https://gitlab.com/codsen/codsen/commit/ca17aa105824d1dc26bd2a23eae6a3c5aa2a5f24))

## 1.11.0 (2019-01-31)

### Features

- Add a new key, `parentType` in a callback `innerObj` ([6e16b99](https://gitlab.com/codsen/codsen/commit/6e16b99))

## 1.10.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.4.0 (2018-10-13)

- ✨ Updated all dependencies and restored coverage tracking both via terminal when testing and through coveralls.io

## 1.3.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 1.2.0 (2018-05-02)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## 1.1.0 (2018-01-03)

- ✨ New key in the `innerObj` callback - `innerObj.path`. It's interoperable with [object-path](https://www.npmjs.com/package/object-path).

## 1.0.1 (2017-12-22)

- ✨ First public release.
