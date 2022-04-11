# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.1.0 (2022-04-11)

### Features

- export defaults and version ([1107244](https://github.com/codsen/codsen/commit/1107244b45eff96ac1fc4ab992031ede0d10ba8c))

## 4.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 3.2.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 3.1.0 (2021-04-11)

### Features

- catch missing spaces after "and" ([714731f](https://github.com/codsen/codsen/commit/714731fc2f4e6c8f9c652072fde6bcb911b9c733))

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 3.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 3.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([8b0282b](https://github.com/codsen/codsen/commit/8b0282b146971b1437467a0f5dad0d12d0afabe4))

### BREAKING CHANGES

- previously: `import isMediaD from ...` - now `import { isMediaD } from ...`

## 2.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.2.2 (2020-02-24)

### Bug Fixes

- loop through the correct parts ([2d4c3f7](https://gitlab.com/codsen/codsen/commit/2d4c3f750032e694b7cff56839eab522989023d5))

## 1.2.0 (2020-01-26)

### Features

- add more brackets logic cases ([e83bc30](https://gitlab.com/codsen/codsen/commit/e83bc301da7c9a9cf406a13f7bd4993d9b268a4b))
- only and, only only, only not cases ([0df6970](https://gitlab.com/codsen/codsen/commit/0df697077ff938c59a5aac17faa05cd4f6bb93fe))
- semicolon safeguards ([f3cccc3](https://gitlab.com/codsen/codsen/commit/f3cccc3f23dce2aad8a8cb57d4836301e71efe69))
- tests create sample HTML's, improve logic in brackets ([9e96eb7](https://gitlab.com/codsen/codsen/commit/9e96eb7286df5a67012be3916c48c3043017938c))
- whitespace clauses ([5cb22cc](https://gitlab.com/codsen/codsen/commit/5cb22cc4c91d478568fd3b7919f6e2f5ea8eedfc))

## 1.1.0 (2020-01-12)

### Features

- write all the logic up until boolean joiners ([e8f918f](https://gitlab.com/codsen/codsen/commit/e8f918fa86eab81cb12277b2d86c5e9d5d7b6646))

## 1.0.0 (2020-01-05)

- ✨ First public release
