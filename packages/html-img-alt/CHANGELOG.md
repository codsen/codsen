# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.1.0 (2022-04-10)

### Features

- export defaults ([1374d22](https://github.com/codsen/codsen/commit/1374d228706a112720b6e0080e308f500b6ae48d))

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

- rewrite in TS, start using named exports ([63faf16](https://github.com/codsen/codsen/commit/63faf16c0c926be440449ca849318c178e4aba9d))

### BREAKING CHANGES

- previously you'd consume like: `import alts from ...` - now: `import { alts } from ...`

## 1.5.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.4.0 (2019-06-01)

### Features

- Migrate to monorepo and some rebasing ([2015845](https://gitlab.com/codsen/codsen/commit/2015845))

## 1.4.0 (2019-04-14)

- ✨ Migrating this package to our main monorepo on GitLab
