# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 3.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 2.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 2.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 2.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 2.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([f0934ca](https://github.com/codsen/codsen/commit/f0934ca364c51fcb1efb63aad717f794daf3d443))

### BREAKING CHANGES

- previously: `import isAttrNameChar from ...` - now `import { isAttrNameChar } from ...`

## 1.2.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.1.0 (2020-04-13)

### Features

- initial scaffolding ([0da2f83](https://gitlab.com/codsen/codsen/commit/0da2f83eac662c8b0f2c82e3dfcfe79f5ef4fd23))
