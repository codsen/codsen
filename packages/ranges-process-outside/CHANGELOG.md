# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 5.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 4.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 4.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 4.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 4.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([292a653](https://github.com/codsen/codsen/commit/292a653459851cdc03a9efdf476fafcfeb6cff46))

### BREAKING CHANGES

- previously you'd consume like: `import rProcessOutside from ...` - now: `import { rProcessOutside } from ...`

## 3.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.2.0 (2019-08-18)

### Features

- support for emoji ([825fae5](https://gitlab.com/codsen/codsen/commit/825fae5))

## 2.1.0 (2019-06-01)

### Features

- Change of the API - ranges are inverted and each character called via cb() ([cd2e2be](https://gitlab.com/codsen/codsen/commit/cd2e2be))
- Offsets ([7ae4a8c](https://gitlab.com/codsen/codsen/commit/7ae4a8c))

## 1.0.0 (2018-01-23)

- ✨ Initial release
