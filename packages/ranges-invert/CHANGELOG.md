# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.13](https://github.com/codsen/codsen/compare/ranges-invert@4.0.12...ranges-invert@4.0.13) (2021-04-03)

**Note:** Version bump only for package ranges-invert





## 4.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 4.0.0 (2021-01-23)

### Features

- rewrite in TS and start using named exports ([e8f27b9](https://github.com/codsen/codsen/commit/e8f27b970a472e65d4da1d45789e867b797ca2c8))

### BREAKING CHANGES

- previously: `import rInvert from ...` - now `import { rInvert } from ...`

## 3.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.1.22 (2019-10-02)

### Performance Improvements

- remove check-types-mini and ordinal numbers dependencies ([e62326c](https://gitlab.com/codsen/codsen/commit/e62326c))

## 2.1.0 (2019-06-01)

### Features

- If ranges exceed reference string length, result is cropped (as opposed to error) ([c05d954](https://gitlab.com/codsen/codsen/commit/c05d954))
- null instead of ranges array produces whole input string ([e3ff153](https://gitlab.com/codsen/codsen/commit/e3ff153))
- opts.skipChecks and precautionary measures when it's on ([b129666](https://gitlab.com/codsen/codsen/commit/b129666))

## 1.4.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.1.0 (2018-10-25)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 1.0.0 (2018-06-09)

- ✨ Initial release
