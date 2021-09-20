# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.2](https://github.com/codsen/codsen/compare/string-extract-sass-vars@3.0.1...string-extract-sass-vars@3.0.2) (2021-09-20)

**Note:** Version bump only for package string-extract-sass-vars





## 3.0.1 (2021-09-13)

### Bug Fixes

- bump TS and separate ESLint plugins away from this monorepo ([2e07d42](https://github.com/codsen/codsen/commit/2e07d424222b6ffedf5fb45c83ad453627ec2904))

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

- rewrite in TS, start using named exports ([e7c4532](https://github.com/codsen/codsen/commit/e7c4532aa231ea85c416e96680ec10d094d0cd27))

### BREAKING CHANGES

- previously: `import extractVars from ...` - now `import { extractVars } from ...`

## 1.3.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.2.0 (2020-04-26)

### Features

- `opts.cb` ([95f873b](https://gitlab.com/codsen/codsen/commit/95f873b1379bc4ad0cfff36ec79338709d417fd3))

## 1.1.0 (2020-04-20)

Initial release

### Features

- `opts.throwIfEmpty` ([76154ae](https://gitlab.com/codsen/codsen/commit/76154ae9b23a42a94ef8d65b4d5c075900c266af))
- init ([6764160](https://gitlab.com/codsen/codsen/commit/676416064a037f8b7f21a6e20a0e291849b77897))
