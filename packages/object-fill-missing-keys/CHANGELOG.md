# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 10.0.0 (2022-10-16)

### Bug Fixes

- set the merging to be correct as per what is promised ([1830aff](https://github.com/codsen/codsen/commit/1830aff6ed92b5431e4bf754d530c2790031b5dd)), closes [#51](https://github.com/codsen/codsen/issues/51)

### BREAKING CHANGES

- during deep merging, if value of the incoming schema is matching what's already
  there, now already there prevails; previously, the schema would prevail

# 9.2.0 (2022-08-12)

### Features

- export types ([8fd7dfe](https://github.com/codsen/codsen/commit/8fd7dfee27df5b0731ddfefa5461fdd033b185f8))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 9.1.2 (2022-04-18)

### Bug Fixes

- tweak types ([050580c](https://github.com/codsen/codsen/commit/050580c1c7935383d499a7f46acb1e6cb44a0ae4))

# 9.1.0 (2022-04-10)

### Features

- export defaults ([53ec13b](https://github.com/codsen/codsen/commit/53ec13b228cf94c140eabc870da29d5e11f67604))

## 9.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 8.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 8.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 8.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 8.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([474db39](https://github.com/codsen/codsen/commit/474db39bc5936c02ca77e74d173ad8a9b44ca052))

### BREAKING CHANGES

- previously you'd consume like: `import fillMissing from ...` - now `import { fillMissing } from ...`

## 7.11.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 7.10.0 (2019-10-02)

### Features

- remove options validation, to make operation 540% faster ([dab767a](https://gitlab.com/codsen/codsen/commit/dab767a))

### Performance Improvements

- tap native Array.isArray to gain around 140 times more speed ([35af347](https://gitlab.com/codsen/codsen/commit/35af347))

## 7.9.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 7.5.0 (2018-12-26)

- Added `opts.doNotFillThesePathsIfTheyContainPlaceholders` ([8c6080e](https://gitlab.com/codsen/codsen/tree/master/packages/object-fill-missing-keys/commits/8c6080e))

## 7.4.0 (2018-10-24)

- Updated all dependencies
- Restored coveralls.io reporting
- Restored unit test linting

## 7.3.0 (2018-08-28)

- Switched to newest Babel (v.7) but `ava`+`esm`+`nyc` didn't work together so we had to disable `nyc`, our code coverage, until further notice
- Added comment removal on Rollup production builds

## 7.2.0 (2018-06-19)

GitHub sold us out. In the meantime, we:

- Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis

## 7.1.0 (2018-05-25)

- Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 7.0.0 (2018-03-13)

### Added

- `opts.useNullAsExplicitFalse`

Since it's on by default, and it behaves differently to if it were off, it's a breaking change and thus warrants a major semver bump.

## 6.0.0 (2018-01-27)

### Changed

- Complete recode from scratch in order to control key creation more precisely (necessary for new features). Previously `object-merge-advanced` did all the job.
- `opts.doNotFillThesePathsIfTheyContainPlaceholders`
- `opts.placeholder`

## 4.0.0 (2017-12-11)

### Changed

- Rebased in ES Modules
- Set up Rollup. Now serving 3 flavours: CommonJS, UMD and ES Module. When this library is used as a dependency, WebPack and Rollup should recognise ES Module wiring via `module` key in package.json and should switch to ES Modules version automatically.
- Fixed few tiny bugs
- Improved unit test coverage to be 100%-lines. I can't do 100%-branches because Babel adds functions which I can't target and we're testing transpiled code. The source is now in ES Modules and everything's covered there.
- 👾 Some other setup tweaks to reflect my latest understanding what's best for npm libraries.

## 3.1.0 (2017-10-14)

### Added

- `opts.placeholder`
- `opts.doNotFillThesePathsIfTheyContainPlaceholders`

## 3.0.0 (2017-10-13)

### Changed

- 🔧 Hardened the API - strange cases with no arguments or wrong-ones will `throw` an error. Hence bumping the major semver release.

## 2.3.0 (2017-10-13)

### Added

- Dropped JS Standard and moved to raw ESLint on `airbnb-base` preset with semicolons off. JS Standard does not have many important rules on, beware.
- Options - third input argument, with all validation (driven by `check-types-mini` [on npm](https://www.npmjs.com/package/check-types-mini), [on GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/check-types-mini))

## 2.2.0 (2017-05-20)

### Added

- cli `clear` when running unit tests (not that relevant for end-user, but totally relevant when maintaining all this)
- now consuming `standard` as a normal semver range, not _the latest greatest_ which is a liability remembering what happened on v10 release
- one more unit test

## 2.1.0 (2017-03-16)

### Changed

- 🔧 Improvements to the merging algorithm

## 2.0.0 (2017-03-16)

### Changed

- 🔧 Rewrote pretty much the whole core of this. Previously, the algorithm did not take into the account the placeholder values and also didn't use an `object-merge-advanced`-class merging, only filled the missing keys. It's fixed now. From practical standpoint, the main difference is when merging two plain objects, if two have the same key but one's value is a string, another's value is array, array will overwrite string. Previously, not so. Basically, now the full hierarchy of `object-merge-advanced` is retained. This might have consequences to any template code that relied on previous algorithm, but it's a bad practice to mix different data types in the template logic anyway, so hey.

### Added

- Even more more unit tests

### Improved

- Put some test variables into correct scope. It does not change anything, but still.
