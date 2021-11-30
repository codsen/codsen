# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.7](https://github.com/codsen/codsen/compare/ast-deep-contains@4.0.5...ast-deep-contains@4.0.7) (2021-11-30)

**Note:** Version bump only for package ast-deep-contains





## 4.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 3.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 3.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 3.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 3.0.0 (2021-01-23)

### Features

- rewrite in TS and start using named exports ([3e15bd3](https://github.com/codsen/codsen/commit/3e15bd3ad49cb570083e56289cba3ab53800afb6))

### BREAKING CHANGES

- previously you'd consume a default export: `import deepContains from ...` - now use `import { deepContains } from ...`

## 2.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.1.0 (2019-11-27)

### Bug Fixes

- add requirement for loose array contents object matching - there must be more than 1 obj ([e90ee45](https://gitlab.com/codsen/codsen/commit/e90ee453df8c3924dbaa6401a70824ba9ab03600))
- fix score calculation ([3601ce2](https://gitlab.com/codsen/codsen/commit/3601ce282fb3f186531198ffb61ad41c1bb3e31b))

### Features

- opts.arrayStrictComparison (set to false by default) ([ef8fcdd](https://gitlab.com/codsen/codsen/commit/ef8fcdd63ec2e31a8ed673e56e64f88171ffe275))

## 1.0.0 (2019-11-11)

- ✨ First public release.
