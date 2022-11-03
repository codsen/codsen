# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 5.2.0 (2022-08-12)

### Features

- export types ([4e6239a](https://github.com/codsen/codsen/commit/4e6239a381a9b9cc6da6a8c300d3dfe920081b92))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

# 5.1.0 (2022-04-10)

### Features

- export defaults ([789335e](https://github.com/codsen/codsen/commit/789335e2d5612f94f3298d3dcf6d4d7fa553516b))

## 5.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 4.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 4.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 4.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 4.0.0 (2021-01-23)

### Features

- rewrite in TS and start using named exports ([e8f27b9](https://github.com/codsen/codsen/commit/e8f27b970a472e65d4da1d45789e867b797ca2c8))

### BREAKING CHANGES

- previously: `import rInvert from ...` - now `import { rInvert } from ...`

## 3.0.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 2.1.22 (2019-10-02)

### Performance Improvements

- remove `check-types-mini` and ordinal numbers dependencies ([e62326c](https://gitlab.com/codsen/codsen/commit/e62326c))

## 2.1.0 (2019-06-01)

### Features

- If ranges exceed reference string length, result is cropped (as opposed to error) ([c05d954](https://gitlab.com/codsen/codsen/commit/c05d954))
- null instead of ranges array produces whole input string ([e3ff153](https://gitlab.com/codsen/codsen/commit/e3ff153))
- `opts.skipChecks` and precautionary measures when it's on ([b129666](https://gitlab.com/codsen/codsen/commit/b129666))

## 1.4.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 1.1.0 (2018-10-25)

- Updated all dependencies
- Restored coveralls.io reporting
- Restored unit test linting

## 1.0.0 (2018-06-09)

- Initial release
