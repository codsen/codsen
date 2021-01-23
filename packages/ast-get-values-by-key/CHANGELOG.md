# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* rewrite in TS and start using named exports ([0380ba1](https://github.com/codsen/codsen/commit/0380ba17617bc1ee043cc8a068d9b0e4f16ce7e1))
* rewrite in TS, use named exports ([0e1c3b6](https://github.com/codsen/codsen/commit/0e1c3b64881849df4271239c25570447aa8c730b))
* some rebasing and examples ([18bd472](https://github.com/codsen/codsen/commit/18bd4724e9e8ce1726d6e3c646e270eba6984d08))
* supplement the getter's result with path ([1594a36](https://github.com/codsen/codsen/commit/1594a36e9dd799f9bcbaf379fc054b1dd55cbd67))


### BREAKING CHANGES

* previously: "import getAllValuesByKey from ..." - now "import { getByKey } from
..."
* previously: "import getAllValuesByKey from ..." - now "import { getByKey } from
..."





## 2.8.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.7.0 (2020-09-27)

### Features

- some rebasing and examples ([7fc5cf5](https://gitlab.com/codsen/codsen/commit/7fc5cf5885d32f1d289ec13ace27c313f9e203ae))

## 2.2.0 (2018-12-26)

### Features

- Supplement the getter's result with path ([1594a36](https://gitlab.com/codsen/codsen/tree/master/packages/ast-get-values-by-key/commits/1594a36))

## 2.1.0 (2018-10-13)

- ✨ Updated all dependencies and restored coverage tracking both via terminal when testing and through coveralls.io

## 2.0.0 (2018-09-27)

🔨 Major API changes: now the result is not array of strings, but array of plain objects, where previous string is under key `val`. This lets us get another key - `path` of that value.

Setter method behaves the same.

## 1.3.0 (2018-06-13)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 1.2.0 (2018-05-14)

### Improved

- ✨ Now pointing unit tests at ES Modules build, not CommonJS-one. This means, unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.
- ✨ Tweaks to ava [config](https://github.com/avajs/ava/blob/master/docs/recipes/es-modules.md) in `package.json`, properly enabling the `dev` Rollup builds.

## 1.1.0 (2018-05-02)

### Added

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## 1.0.0 (2018-03-11)

- ✨ First public release
