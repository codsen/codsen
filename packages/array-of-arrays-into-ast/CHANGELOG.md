# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 2.0.1 (2021-01-28)


### Bug Fixes

* add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))





# 2.0.0 (2021-01-23)

### Features

- rewrite in TS and start using named exports ([2e263be](https://github.com/codsen/codsen/commit/2e263be6dc7bf879cc27c97d2e95460cf85011f5))

### BREAKING CHANGES

- previously you'd consume like: `import generateAst from ...` — now `import { generateAst } from ...`

## 1.10.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.9.0 (2019-06-29)

### Features

- Add perf checking, recording and historic comparison ([173308e](https://gitlab.com/codsen/codsen/commit/173308e))

## 1.8.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.4.0 (2018-12-14)

- ✨ Updated all dependencies and restored AVA linting, added licence to the top of each built file

## 1.3.0 (2018-10-12)

- ✨ Updated all dependencies and restored coverage reporting both in terminal and sending to coveralls

## 1.2.0 (2018-05-11)

- ✨ Pointed AVA unit tests to ES Modules build, as opposed to previously transpiled CommonJS-one. This means, now unit test code coverage is correct.

## 1.1.0 (2018-04-29)

- ✨ Setup refresh and dependency updates: deleted `package-lock.json` and `.editorconfig`

## 1.0.0 (2018-03-31)

- ✨ Public release
