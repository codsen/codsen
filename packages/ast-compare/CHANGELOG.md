# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* Add perf measurement, recording and historical comparison ([5bc57b7](https://github.com/codsen/codsen/commit/5bc57b7fb72d2b0bffbb2c4b329236815b0f12e2))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* make the run 11 times faster ([80ed093](https://github.com/codsen/codsen/commit/80ed0937b253ac40a370d5fcd991938f334cc7fc))
* opts.useWildcards ([d541cab](https://github.com/codsen/codsen/commit/d541cab621d2710280d95c236f84500af4c96045))
* rewrite in TS and start using named exports ([6a75380](https://github.com/codsen/codsen/commit/6a75380a2141e476126a592fe879ebd5ffef5fab))


### Performance Improvements

* remove check-types-mini ([7ccae5e](https://github.com/codsen/codsen/commit/7ccae5e05a7794f45f1e39135c0759fbbeb358e7))


### BREAKING CHANGES

* previously you'd import like: "import compare from ..." - now do: "import { compare
} from ..."





## 1.14.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.13.0 (2020-01-26)

### Features

- make the run 11 times faster ([a9ea3f0](https://gitlab.com/codsen/codsen/commit/a9ea3f0da6aa752dac9987aef81cbd047d965ced))

## 1.12.19 (2019-10-07)

### Performance Improvements

- remove check-types-mini ([0503752](https://gitlab.com/codsen/codsen/commit/0503752))

## 1.12.0 (2019-06-29)

### Features

- Add perf measurement, recording and historical comparison ([8266d21](https://gitlab.com/codsen/codsen/commit/8266d21))

## 1.11.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.7.0 (2018-12-26)

- ✨ opts.useWildcards ([d541cab](https://gitlab.com/codsen/codsen/tree/master/packages/ast-compare/commits/d541cab))

## 1.6.0 (2018-10-12)

- ✨ Updated all dependencies and restored unit test coverage tracking, both via terminal and via coveralls.io

## 1.5.0 (2018-06-13)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 1.4.0 (2018-05-14)

### Improved

- ✨ Now pointing unit tests at ES Modules build, not CommonJS-one. This means, unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.
- ✨ Tweaks to ava [config](https://github.com/avajs/ava/blob/master/docs/recipes/es-modules.md) in `package.json`, properly enabling the `dev` Rollup builds.

## 1.3.0 (2018-05-01)

### Added

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## 1.2.0 (2018-02-11)

### Added

- ✨ `opts.useWildcards` is driven by [matcher](https://github.com/sindresorhus/matcher) and `matcher` up until today was case-insensitive. Today they released the case-sensitive mode and we switched to that. Now all behaviour in wildcards should match non-glob behaviour, case-wise.

## 1.1.0 (2017-10-29)

### Added

- ✨ `opts.useWildcards` (off by default)

## 1.0.0 (2017-10-24)

### Added

- ✨ Public release
